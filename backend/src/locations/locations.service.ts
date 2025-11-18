import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
  ) {}

  async create(createLocationDto: CreateLocationDto, tenantId: string): Promise<Location> {
    const location = this.locationsRepository.create({
      ...createLocationDto,
      tenantId,
    });
    return this.locationsRepository.save(location);
  }

  async findAll(tenantId: string, businessId?: string): Promise<Location[]> {
    const where: any = { tenantId };
    if (businessId) {
      where.businessId = businessId;
    }
    return this.locationsRepository.find({
      where,
      relations: ['business', 'staffMembers'],
    });
  }

  async findById(id: string, tenantId: string): Promise<Location> {
    const location = await this.locationsRepository.findOne({
      where: { id, tenantId },
      relations: ['business', 'staffMembers'],
    });
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    return location;
  }

  async update(id: string, updateLocationDto: UpdateLocationDto, tenantId: string): Promise<Location> {
    await this.locationsRepository.update({ id, tenantId }, updateLocationDto);
    return this.findById(id, tenantId);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const location = await this.findById(id, tenantId);
    await this.locationsRepository.softRemove(location);
  }
}
