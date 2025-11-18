import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentTenant } from '../auth/decorators/tenant.decorator';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new notification' })
  create(@Body() createNotificationDto: CreateNotificationDto, @CurrentTenant() tenantId: string) {
    return this.notificationsService.create(createNotificationDto, tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  findAll(@CurrentTenant() tenantId: string) {
    return this.notificationsService.findAll(tenantId);
  }
}
