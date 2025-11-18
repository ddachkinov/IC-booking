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
import { StaffService } from './staff.service';
import { CreateStaffMemberDto } from './dto/create-staff-member.dto';
import { UpdateStaffMemberDto } from './dto/update-staff-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentTenant } from '../auth/decorators/tenant.decorator';

@ApiTags('staff')
@Controller('staff')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @ApiOperation({ summary: 'Create new staff member' })
  create(@Body() createStaffDto: CreateStaffMemberDto, @CurrentTenant() tenantId: string) {
    return this.staffService.create(createStaffDto, tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all staff members' })
  findAll(@CurrentTenant() tenantId: string, @Query('businessId') businessId?: string) {
    return this.staffService.findAll(tenantId, businessId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get staff member by ID' })
  findOne(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.staffService.findById(id, tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update staff member' })
  update(
    @Param('id') id: string,
    @Body() updateStaffDto: UpdateStaffMemberDto,
    @CurrentTenant() tenantId: string,
  ) {
    return this.staffService.update(id, updateStaffDto, tenantId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete staff member' })
  remove(@Param('id') id: string, @CurrentTenant() tenantId: string) {
    return this.staffService.remove(id, tenantId);
  }
}
