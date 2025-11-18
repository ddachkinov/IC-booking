import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from './entities/business.entity';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export class BusinessesService {
  constructor(
    @InjectRepository(Business)
    private businessesRepository: Repository<Business>,
  ) {}

  async create(createBusinessDto: CreateBusinessDto, tenantId: string): Promise<Business> {
    const business = this.businessesRepository.create({
      ...createBusinessDto,
      tenantId,
    });
    return this.businessesRepository.save(business);
  }

  async findAll(tenantId: string): Promise<Business[]> {
    return this.businessesRepository.find({ where: { tenantId } });
  }

  async findById(id: string, tenantId: string): Promise<Business> {
    const business = await this.businessesRepository.findOne({
      where: { id, tenantId },
      relations: ['locations', 'services', 'staff'],
    });
    if (!business) {
      throw new NotFoundException(`Business with ID ${id} not found`);
    }
    return business;
  }

  async update(id: string, updateBusinessDto: UpdateBusinessDto, tenantId: string): Promise<Business> {
    await this.businessesRepository.update({ id, tenantId }, updateBusinessDto);
    return this.findById(id, tenantId);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const business = await this.findById(id, tenantId);
    await this.businessesRepository.softRemove(business);
  }
}
