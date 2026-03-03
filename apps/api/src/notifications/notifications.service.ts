import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(@InjectQueue('email-queue') private emailQueue: Queue) { }

    async queueAnnouncementNotification(schoolId: string, data: any) {
        this.logger.log(`Queueing announcement: ${data.title}`);

        // Add job to BullMQ queue
        await this.emailQueue.add('send-announcement-email', {
            schoolId,
            title: data.title,
            body: data.body,
            targetRoles: data.targetRoles
        });
    }
}
