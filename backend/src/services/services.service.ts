import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto, tenantId: string): Promise<Service> {
    const service = this.servicesRepository.create({
      ...createServiceDto,
      tenantId,
    });
    return this.servicesRepository.save(service);
  }

  async findAll(tenantId: string, businessId?: string): Promise<Service[]> {
    const where: any = { tenantId };
    if (businessId) {
      where.businessId = businessId;
    }
    return this.servicesRepository.find({
      where,
      relations: ['business', 'staffMembers'],
    });
  }

  async findById(id: string, tenantId: string): Promise<Service> {
    const service = await this.servicesRepository.findOne({
      where: { id, tenantId },
      relations: ['business', 'staffMembers'],
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto, tenantId: string): Promise<Service> {
    await this.servicesRepository.update({ id, tenantId }, updateServiceDto);
    return this.findById(id, tenantId);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const service = await this.findById(id, tenantId);
    await this.servicesRepository.softRemove(service);
  }
}
