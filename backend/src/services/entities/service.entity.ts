import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { Business } from '../../businesses/entities/business.entity';
import { StaffMember } from '../../staff/entities/staff-member.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('services')
export class Service extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  businessId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  duration: number; // in minutes

  @Column({ type: 'int', nullable: true })
  bufferTime: number; // buffer time after appointment in minutes

  @Column({ nullable: true })
  color: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  allowOnlineBooking: boolean;

  @Column({ type: 'int', nullable: true })
  maxAdvanceBookingDays: number;

  @Column({ type: 'int', nullable: true })
  minAdvanceBookingHours: number;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @ManyToOne(() => Business, (business) => business.services)
  @JoinColumn({ name: 'businessId' })
  business: Business;

  @ManyToMany(() => StaffMember, (staffMember) => staffMember.services)
  staffMembers: StaffMember[];

  @OneToMany(() => Appointment, (appointment) => appointment.service)
  appointments: Appointment[];
}
