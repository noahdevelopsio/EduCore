import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

@Injectable()
export class AnnouncementsRepository {
    constructor(private prisma: PrismaService) { }

    async create(schoolId: string, authorId: string, data: CreateAnnouncementDto) {
        return this.prisma.announcement.create({
            data: {
                schoolId,
                createdById: authorId,
                title: data.title,
                body: data.body,
                targetRoles: data.targetRoles,
            },
        });
    }

    async findAll(schoolId: string) {
        return this.prisma.announcement.findMany({
            where: { schoolId },
            orderBy: { createdAt: 'desc' },
        });
    }
}
