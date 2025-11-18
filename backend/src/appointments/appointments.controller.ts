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
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentTenant } from '../auth/decorators/tenant.decorator';

@ApiTags('appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new appointment' })
  create(@Body() createAppointmentDto: CreateAppointmentDto, @CurrentTenant() tenantId: string) {
    return this.appointmentsService.create(createAppointmentDto, tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all appointments' })
  findAll(
    @CurrentTenant() tenantId: string,
    @Query('businessId') businessId?: string,
    @Query('staffMemberId') staffMemberId?: string,
    @Query('clientId') clientId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.appointmentsService.findAll(
      tenantId,
      businessId,
      staffMemberId,
      clientId,
      startDate,
      endDate,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment by ID' })
  findOne(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.appointmentsService.findById(id, tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update appointment' })
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @CurrentTenant() tenantId: string,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto, tenantId);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel appointment' })
  cancel(
    @Param('id') id: string,
    @Body() cancelDto: CancelAppointmentDto,
    @CurrentTenant() tenantId: string,
  ) {
    return this.appointmentsService.cancel(id, cancelDto.reason, tenantId);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Mark appointment as completed' })
  complete(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.appointmentsService.complete(id, tenantId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete appointment' })
  remove(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.appointmentsService.remove(id, tenantId);
  }
}
