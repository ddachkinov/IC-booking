import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment, AppointmentStatus } from '../appointments/entities/appointment.entity';
import { Client } from '../clients/entities/client.entity';
import { Service } from '../services/entities/service.entity';
import { StaffMember } from '../staff/entities/staff-member.entity';

export interface DashboardStats {
  totalRevenue: number;
  totalAppointments: number;
  totalClients: number;
  completedAppointments: number;
  cancelledAppointments: number;
  upcomingAppointments: number;
  averageAppointmentValue: number;
}

export interface TopService {
  id: string;
  name: string;
  appointmentCount: number;
  revenue: number;
}

export interface StaffPerformance {
  id: string;
  name: string;
  appointmentCount: number;
  revenue: number;
  completionRate: number;
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    @InjectRepository(StaffMember)
    private staffRepository: Repository<StaffMember>,
  ) {}

  async getDashboardStats(tenantId: string, businessId?: string, startDate?: Date, endDate?: Date): Promise<DashboardStats> {
    const where: any = { tenantId };
    if (businessId) where.businessId = businessId;
    if (startDate && endDate) {
      where.startTime = Between(startDate, endDate);
    }

    const appointments = await this.appointmentsRepository.find({ where });

    const totalRevenue = appointments
      .filter(a => a.status === AppointmentStatus.COMPLETED)
      .reduce((sum, a) => sum + Number(a.price), 0);

    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(a => a.status === AppointmentStatus.COMPLETED).length;
    const cancelledAppointments = appointments.filter(a => a.status === AppointmentStatus.CANCELLED).length;
    const upcomingAppointments = appointments.filter(
      a => a.status === AppointmentStatus.SCHEDULED || a.status === AppointmentStatus.CONFIRMED
    ).length;

    const averageAppointmentValue = completedAppointments > 0 ? totalRevenue / completedAppointments : 0;

    const clientWhere: any = { tenantId };
    if (businessId) clientWhere.businessId = businessId;
    const totalClients = await this.clientsRepository.count({ where: clientWhere });

    return {
      totalRevenue,
      totalAppointments,
      totalClients,
      completedAppointments,
      cancelledAppointments,
      upcomingAppointments,
      averageAppointmentValue,
    };
  }

  async getTopServices(tenantId: string, businessId?: string, limit: number = 10): Promise<TopService[]> {
    const query = this.appointmentsRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.service', 'service')
      .where('appointment.tenantId = :tenantId', { tenantId })
      .andWhere('appointment.status = :status', { status: AppointmentStatus.COMPLETED });

    if (businessId) {
      query.andWhere('appointment.businessId = :businessId', { businessId });
    }

    const appointments = await query.getMany();

    const serviceMap = new Map<string, TopService>();

    appointments.forEach(appointment => {
      const serviceId = appointment.serviceId;
      if (!serviceMap.has(serviceId)) {
        serviceMap.set(serviceId, {
          id: serviceId,
          name: appointment.service?.name || 'Unknown',
          appointmentCount: 0,
          revenue: 0,
        });
      }

      const service = serviceMap.get(serviceId)!;
      service.appointmentCount++;
      service.revenue += Number(appointment.price);
    });

    return Array.from(serviceMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);
  }

  async getStaffPerformance(tenantId: string, businessId?: string, limit: number = 10): Promise<StaffPerformance[]> {
    const query = this.appointmentsRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.staffMember', 'staffMember')
      .leftJoinAndSelect('staffMember.user', 'user')
      .where('appointment.tenantId = :tenantId', { tenantId });

    if (businessId) {
      query.andWhere('appointment.businessId = :businessId', { businessId });
    }

    const appointments = await query.getMany();

    const staffMap = new Map<string, any>();

    appointments.forEach(appointment => {
      const staffId = appointment.staffMemberId;
      if (!staffMap.has(staffId)) {
        const user = appointment.staffMember?.user;
        staffMap.set(staffId, {
          id: staffId,
          name: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
          appointmentCount: 0,
          completedCount: 0,
          revenue: 0,
        });
      }

      const staff = staffMap.get(staffId)!;
      staff.appointmentCount++;
      if (appointment.status === AppointmentStatus.COMPLETED) {
        staff.completedCount++;
        staff.revenue += Number(appointment.price);
      }
    });

    const performance = Array.from(staffMap.values()).map(staff => ({
      id: staff.id,
      name: staff.name,
      appointmentCount: staff.appointmentCount,
      revenue: staff.revenue,
      completionRate: staff.appointmentCount > 0 ? (staff.completedCount / staff.appointmentCount) * 100 : 0,
    }));

    return performance
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);
  }
}
