import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentTenant } from '../auth/decorators/tenant.decorator';

@ApiTags('clients')
@Controller('clients')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new client' })
  create(@Body() createClientDto: CreateClientDto, @CurrentTenant() tenantId: string) {
    return this.clientsService.create(createClientDto, tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  findAll(@CurrentTenant() tenantId: string, @Query('businessId') businessId?: string) {
    return this.clientsService.findAll(tenantId, businessId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by ID' })
  findOne(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.clientsService.findById(id, tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update client' })
  update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @CurrentTenant() tenantId: string,
  ) {
    return this.clientsService.update(id, updateClientDto, tenantId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete client' })
  remove(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.clientsService.remove(id, tenantId);
  }
}
