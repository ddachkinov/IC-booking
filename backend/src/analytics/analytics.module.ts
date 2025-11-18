import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Client } from '../clients/entities/client.entity';
import { Service } from '../services/entities/service.entity';
import { StaffMember } from '../staff/entities/staff-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Client, Service, StaffMember])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
