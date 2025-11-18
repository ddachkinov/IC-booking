import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffMember } from './entities/staff-member.entity';
import { CreateStaffMemberDto } from './dto/create-staff-member.dto';
import { UpdateStaffMemberDto } from './dto/update-staff-member.dto';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(StaffMember)
    private staffRepository: Repository<StaffMember>,
  ) {}

  async create(createStaffDto: CreateStaffMemberDto, tenantId: string): Promise<StaffMember> {
    const staffMember = this.staffRepository.create({
      ...createStaffDto,
      tenantId,
    });
    return this.staffRepository.save(staffMember);
  }

  async findAll(tenantId: string, businessId?: string): Promise<StaffMember[]> {
    const where: any = { tenantId };
    if (businessId) {
      where.businessId = businessId;
    }
    return this.staffRepository.find({
      where,
      relations: ['user', 'business', 'services', 'locations'],
    });
  }

  async findById(id: string, tenantId: string): Promise<StaffMember> {
    const staffMember = await this.staffRepository.findOne({
      where: { id, tenantId },
      relations: ['user', 'business', 'services', 'locations'],
    });
    if (!staffMember) {
      throw new NotFoundException(`Staff member with ID ${id} not found`);
    }
    return staffMember;
  }

  async update(id: string, updateStaffDto: UpdateStaffMemberDto, tenantId: string): Promise<StaffMember> {
    await this.staffRepository.update({ id, tenantId }, updateStaffDto);
    return this.findById(id, tenantId);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const staffMember = await this.findById(id, tenantId);
    await this.staffRepository.softRemove(staffMember);
  }
}
