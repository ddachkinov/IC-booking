import { IsUUID, IsEnum, IsOptional, IsString, IsNumber, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StaffRole, StaffStatus } from '../entities/staff-member.entity';

export class CreateStaffMemberDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsUUID()
  businessId: string;

  @ApiProperty({ enum: StaffRole })
  @IsEnum(StaffRole)
  role: StaffRole;

  @ApiProperty({ enum: StaffStatus, required: false })
  @IsOptional()
  @IsEnum(StaffStatus)
  status?: StaffStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  commissionRate?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  workingHours?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  permissions?: Record<string, boolean>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  canBookAppointments?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  showInBooking?: boolean;
}
