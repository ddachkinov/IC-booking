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

@Entity('locations')
export class Location extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  businessId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ nullable: true })
  country: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'jsonb', default: {} })
  businessHours: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Business, (business) => business.locations)
  @JoinColumn({ name: 'businessId' })
  business: Business;

  @ManyToMany(() => StaffMember, (staffMember) => staffMember.locations)
  staffMembers: StaffMember[];

  @OneToMany(() => Appointment, (appointment) => appointment.location)
  appointments: Appointment[];
}
