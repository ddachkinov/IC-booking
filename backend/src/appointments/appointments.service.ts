import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, MoreThan } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, tenantId: string): Promise<Appointment> {
    // Check for conflicts
    const hasConflict = await this.checkConflict(
      createAppointmentDto.staffMemberId,
      new Date(createAppointmentDto.startTime),
      new Date(createAppointmentDto.endTime),
      tenantId,
    );

    if (hasConflict) {
      throw new ConflictException('Staff member already has an appointment during this time');
    }

    const appointment = this.appointmentsRepository.create({
      ...createAppointmentDto,
      tenantId,
      startTime: new Date(createAppointmentDto.startTime),
      endTime: new Date(createAppointmentDto.endTime),
    });

    return this.appointmentsRepository.save(appointment);
  }

  async findAll(
    tenantId: string,
    businessId?: string,
    staffMemberId?: string,
    clientId?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<Appointment[]> {
    const where: any = { tenantId };

    if (businessId) where.businessId = businessId;
    if (staffMemberId) where.staffMemberId = staffMemberId;
    if (clientId) where.clientId = clientId;

    if (startDate && endDate) {
      where.startTime = Between(new Date(startDate), new Date(endDate));
    }

    return this.appointmentsRepository.find({
      where,
      relations: ['client', 'service', 'staffMember', 'location', 'business'],
      order: { startTime: 'ASC' },
    });
  }

  async findById(id: string, tenantId: string): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id, tenantId },
      relations: ['client', 'service', 'staffMember', 'location', 'business'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
    tenantId: string,
  ): Promise<Appointment> {
    const appointment = await this.findById(id, tenantId);

    // Check for conflicts if time or staff member changed
    if (
      updateAppointmentDto.startTime ||
      updateAppointmentDto.endTime ||
      updateAppointmentDto.staffMemberId
    ) {
      const startTime = updateAppointmentDto.startTime
        ? new Date(updateAppointmentDto.startTime)
        : appointment.startTime;
      const endTime = updateAppointmentDto.endTime
        ? new Date(updateAppointmentDto.endTime)
        : appointment.endTime;
      const staffMemberId = updateAppointmentDto.staffMemberId || appointment.staffMemberId;

      const hasConflict = await this.checkConflict(
        staffMemberId,
        startTime,
        endTime,
        tenantId,
        id, // Exclude current appointment
      );

      if (hasConflict) {
        throw new ConflictException('Staff member already has an appointment during this time');
      }
    }

    await this.appointmentsRepository.update({ id, tenantId }, updateAppointmentDto);
    return this.findById(id, tenantId);
  }

  async cancel(id: string, reason: string, tenantId: string): Promise<Appointment> {
    const appointment = await this.findById(id, tenantId);

    appointment.status = AppointmentStatus.CANCELLED;
    appointment.cancellationReason = reason;
    appointment.cancelledAt = new Date();

    return this.appointmentsRepository.save(appointment);
  }

  async complete(id: string, tenantId: string): Promise<Appointment> {
    const appointment = await this.findById(id, tenantId);

    appointment.status = AppointmentStatus.COMPLETED;
    appointment.completedAt = new Date();

    return this.appointmentsRepository.save(appointment);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const appointment = await this.findById(id, tenantId);
    await this.appointmentsRepository.softRemove(appointment);
  }

  private async checkConflict(
    staffMemberId: string,
    startTime: Date,
    endTime: Date,
    tenantId: string,
    excludeAppointmentId?: string,
  ): Promise<boolean> {
    const query = this.appointmentsRepository
      .createQueryBuilder('appointment')
      .where('appointment.tenantId = :tenantId', { tenantId })
      .andWhere('appointment.staffMemberId = :staffMemberId', { staffMemberId })
      .andWhere('appointment.status NOT IN (:...statuses)', {
        statuses: [AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED],
      })
      .andWhere(
        '(appointment.startTime < :endTime AND appointment.endTime > :startTime)',
        { startTime, endTime },
      );

    if (excludeAppointmentId) {
      query.andWhere('appointment.id != :excludeAppointmentId', { excludeAppointmentId });
    }

    const conflicts = await query.getCount();
    return conflicts > 0;
  }
}
