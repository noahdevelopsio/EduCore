import { Injectable } from '@nestjs/common';
import { AnnouncementsRepository } from './announcements.repository';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AnnouncementsService {
    constructor(
        private readonly announcementsRepo: AnnouncementsRepository,
        private readonly notificationsService: NotificationsService
    ) { }

    async create(schoolId: string, authorId: string, data: CreateAnnouncementDto) {
        const announcement = await this.announcementsRepo.create(schoolId, authorId, data);

        // Dispatch async notification job (email)
        await this.notificationsService.queueAnnouncementNotification(schoolId, data);

        return announcement;
    }

    async findAll(schoolId: string) {
        return this.announcementsRepo.findAll(schoolId);
    }
}
