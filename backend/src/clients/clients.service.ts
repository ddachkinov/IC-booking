import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto, tenantId: string): Promise<Client> {
    const client = this.clientsRepository.create({
      ...createClientDto,
      tenantId,
    });
    return this.clientsRepository.save(client);
  }

  async findAll(tenantId: string, businessId?: string): Promise<Client[]> {
    const where: any = { tenantId };
    if (businessId) {
      where.businessId = businessId;
    }
    return this.clientsRepository.find({
      where,
      relations: ['business', 'appointments'],
    });
  }

  async findById(id: string, tenantId: string): Promise<Client> {
    const client = await this.clientsRepository.findOne({
      where: { id, tenantId },
      relations: ['business', 'appointments'],
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto, tenantId: string): Promise<Client> {
    await this.clientsRepository.update({ id, tenantId }, updateClientDto);
    return this.findById(id, tenantId);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const client = await this.findById(id, tenantId);
    await this.clientsRepository.softRemove(client);
  }
}
