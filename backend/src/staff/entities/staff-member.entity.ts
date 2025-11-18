import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { User } from '../../users/entities/user.entity';
import { Business } from '../../businesses/entities/business.entity';
import { Service } from '../../services/entities/service.entity';
import { Location } from '../../locations/entities/location.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';

export enum StaffRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  STAFF = 'staff',
  RECEPTIONIST = 'receptionist',
}

export enum StaffStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  INVITED = 'invited',
}

@Entity('staff_members')
export class StaffMember extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  businessId: string;

  @Column({
    type: 'enum',
    enum: StaffRole,
    default: StaffRole.STAFF,
  })
  role: StaffRole;

  @Column({
    type: 'enum',
    enum: StaffStatus,
    default: StaffStatus.INVITED,
  })
  status: StaffStatus;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  commissionRate: number;

  @Column({ type: 'jsonb', default: {} })
  workingHours: Record<string, any>;

  @Column({ type: 'jsonb', default: {} })
  permissions: Record<string, boolean>;

  @Column({ default: true })
  canBookAppointments: boolean;

  @Column({ default: true })
  showInBooking: boolean;

  @ManyToOne(() => User, (user) => user.staffMemberships)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Business, (business) => business.staff)
  @JoinColumn({ name: 'businessId' })
  business: Business;

  @ManyToMany(() => Service, (service) => service.staffMembers)
  @JoinTable({
    name: 'staff_services',
    joinColumn: { name: 'staffMemberId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'serviceId', referencedColumnName: 'id' },
  })
  services: Service[];

  @ManyToMany(() => Location, (location) => location.staffMembers)
  @JoinTable({
    name: 'staff_locations',
    joinColumn: { name: 'staffMemberId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'locationId', referencedColumnName: 'id' },
  })
  locations: Location[];

  @OneToMany(() => Appointment, (appointment) => appointment.staffMember)
  appointments: Appointment[];
}
