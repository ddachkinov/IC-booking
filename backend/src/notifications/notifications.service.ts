import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  Notification,
  NotificationType,
  NotificationStatus,
  NotificationTemplate,
} from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto, tenantId: string): Promise<Notification> {
    const notification = this.notificationsRepository.create({
      ...createNotificationDto,
      tenantId,
    });
    return this.notificationsRepository.save(notification);
  }

  async findAll(tenantId: string): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsSent(id: string): Promise<void> {
    await this.notificationsRepository.update(id, {
      status: NotificationStatus.SENT,
      sentAt: new Date(),
    });
  }

  async markAsFailed(id: string, errorMessage: string): Promise<void> {
    const notification = await this.notificationsRepository.findOne({ where: { id } });
    if (notification) {
      await this.notificationsRepository.update(id, {
        status: NotificationStatus.FAILED,
        errorMessage,
        retryCount: notification.retryCount + 1,
      });
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async processPendingNotifications(): Promise<void> {
    const pendingNotifications = await this.notificationsRepository.find({
      where: [
        { status: NotificationStatus.PENDING, scheduledFor: LessThan(new Date()) },
        { status: NotificationStatus.PENDING, scheduledFor: null },
      ],
      take: 100,
    });

    for (const notification of pendingNotifications) {
      if (notification.retryCount >= notification.maxRetries) {
        await this.markAsFailed(notification.id, 'Max retries exceeded');
        continue;
      }

      try {
        await this.sendNotification(notification);
        await this.markAsSent(notification.id);
      } catch (error) {
        await this.markAsFailed(notification.id, error.message);
      }
    }
  }

  private async sendNotification(notification: Notification): Promise<void> {
    // TODO: Implement actual email/SMS sending logic
    // For now, just log
    console.log(`Sending ${notification.type} notification to ${notification.recipient}`);
    console.log(`Template: ${notification.template}`);
    console.log(`Content: ${notification.content}`);

    // Example implementation:
    // if (notification.type === NotificationType.EMAIL) {
    //   await this.emailService.send(notification.recipient, notification.subject, notification.content);
    // } else if (notification.type === NotificationType.SMS) {
    //   await this.smsService.send(notification.recipient, notification.content);
    // }
  }

  async scheduleAppointmentReminder(
    tenantId: string,
    email: string,
    phone: string,
    appointmentData: any,
    scheduledFor: Date,
  ): Promise<void> {
    // Email reminder
    await this.create(
      {
        type: NotificationType.EMAIL,
        template: NotificationTemplate.APPOINTMENT_REMINDER,
        recipient: email,
        subject: 'Appointment Reminder',
        content: `You have an appointment scheduled for ${appointmentData.startTime}`,
        data: appointmentData,
        scheduledFor,
      },
      tenantId,
    );

    // SMS reminder (if phone provided)
    if (phone) {
      await this.create(
        {
          type: NotificationType.SMS,
          template: NotificationTemplate.APPOINTMENT_REMINDER,
          recipient: phone,
          content: `Reminder: Appointment at ${appointmentData.startTime}`,
          data: appointmentData,
          scheduledFor,
        },
        tenantId,
      );
    }
  }
}
