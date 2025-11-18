import { IsEnum, IsString, IsOptional, IsDateString, IsObject, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType, NotificationTemplate } from '../entities/notification.entity';

export class CreateNotificationDto {
  @ApiProperty({ enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ enum: NotificationTemplate })
  @IsEnum(NotificationTemplate)
  template: NotificationTemplate;

  @ApiProperty()
  @IsString()
  recipient: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  scheduledFor?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxRetries?: number;
}
