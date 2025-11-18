import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { TenantBaseEntity } from '../../common/entities/tenant-base.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Location } from '../../locations/entities/location.entity';
import { Service } from '../../services/entities/service.entity';
import { StaffMember } from '../../staff/entities/staff-member.entity';
import { Client } from '../../clients/entities/client.entity';

export enum BusinessType {
  SALON = 'salon',
  SPA = 'spa',
  CLINIC = 'clinic',
  GYM = 'gym',
  DENTAL = 'dental',
  MEDICAL = 'medical',
  OTHER = 'other',
}

@Entity('businesses')
export class Business extends TenantBaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: BusinessType,
    default: BusinessType.OTHER,
  })
  type: BusinessType;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'jsonb', default: {} })
  businessHours: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  timezone: string;

  @Column({ type: 'text', nullable: true })
  currency: string;

  @Column({ type: 'jsonb', default: {} })
  settings: Record<string, any>;

  @ManyToOne(() => Tenant, (tenant) => tenant.businesses)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @OneToMany(() => Location, (location) => location.business)
  locations: Location[];

  @OneToMany(() => Service, (service) => service.business)
  services: Service[];

  @OneToMany(() => StaffMember, (staffMember) => staffMember.business)
  staff: StaffMember[];

  @OneToMany(() => Client, (client) => client.business)
  clients: Client[];
}
