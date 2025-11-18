import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { Business } from '../../businesses/entities/business.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('clients')
export class Client extends TenantBaseEntity {
  @Column({ type: 'uuid' })
  businessId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ nullable: true })
  country: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'jsonb', default: {} })
  preferences: Record<string, any>;

  @Column({ type: 'jsonb', default: [] })
  tags: string[];

  @Column({ default: 0 })
  totalAppointments: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalSpent: number;

  @Column({ type: 'timestamp', nullable: true })
  lastVisit: Date;

  @Column({ default: true })
  allowSmsNotifications: boolean;

  @Column({ default: true })
  allowEmailNotifications: boolean;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Business, (business) => business.clients)
  @JoinColumn({ name: 'businessId' })
  business: Business;

  @OneToMany(() => Appointment, (appointment) => appointment.client)
  appointments: Appointment[];

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
