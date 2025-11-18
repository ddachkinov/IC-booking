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
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentTenant } from '../auth/decorators/tenant.decorator';

@ApiTags('services')
@Controller('services')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new service' })
  create(@Body() createServiceDto: CreateServiceDto, @CurrentTenant() tenantId: string) {
    return this.servicesService.create(createServiceDto, tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  findAll(@CurrentTenant() tenantId: string, @Query('businessId') businessId?: string) {
    return this.servicesService.findAll(tenantId, businessId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service by ID' })
  findOne(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.servicesService.findById(id, tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update service' })
  update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @CurrentTenant() tenantId: string,
  ) {
    return this.servicesService.update(id, updateServiceDto, tenantId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete service' })
  remove(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.servicesService.remove(id, tenantId);
  }
}
