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
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentTenant } from '../auth/decorators/tenant.decorator';

@ApiTags('locations')
@Controller('locations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new location' })
  create(@Body() createLocationDto: CreateLocationDto, @CurrentTenant() tenantId: string) {
    return this.locationsService.create(createLocationDto, tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all locations' })
  findAll(@CurrentTenant() tenantId: string, @Query('businessId') businessId?: string) {
    return this.locationsService.findAll(tenantId, businessId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get location by ID' })
  findOne(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.locationsService.findById(id, tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update location' })
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
    @CurrentTenant() tenantId: string,
  ) {
    return this.locationsService.update(id, updateLocationDto, tenantId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete location' })
  remove(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.locationsService.remove(id, tenantId);
  }
}
