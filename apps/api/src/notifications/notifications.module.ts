import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsService } from './notifications.service';
import { EmailProcessor } from './processors/email.processor';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'email-queue',
        }),
    ],
    providers: [NotificationsService, EmailProcessor],
    exports: [NotificationsService],
})
export class NotificationsModule { }
