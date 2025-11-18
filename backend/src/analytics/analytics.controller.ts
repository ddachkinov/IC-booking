import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentTenant } from '../auth/decorators/tenant.decorator';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  getDashboardStats(
    @CurrentTenant() tenantId: string,
    @Query('businessId') businessId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.analyticsService.getDashboardStats(tenantId, businessId, start, end);
  }

  @Get('top-services')
  @ApiOperation({ summary: 'Get top performing services' })
  getTopServices(
    @CurrentTenant() tenantId: string,
    @Query('businessId') businessId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.analyticsService.getTopServices(tenantId, businessId, limit);
  }

  @Get('staff-performance')
  @ApiOperation({ summary: 'Get staff performance metrics' })
  getStaffPerformance(
    @CurrentTenant() tenantId: string,
    @Query('businessId') businessId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.analyticsService.getStaffPerformance(tenantId, businessId, limit);
  }
}
