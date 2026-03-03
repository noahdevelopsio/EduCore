import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('announcements')
export class AnnouncementsController {
    constructor(private readonly announcementsService: AnnouncementsService) { }

    @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.TEACHER)
    @Post()
    async create(@Req() req: any, @Body() data: CreateAnnouncementDto) {
        const schoolId = req.user.schoolId;
        const authorId = req.user.id;
        const result = await this.announcementsService.create(schoolId, authorId, data);
        return { success: true, data: result, message: 'Announcement created successfully' };
    }

    @Get()
    async findAll(@Req() req: any) {
        const schoolId = req.user.schoolId;
        const result = await this.announcementsService.findAll(schoolId);
        return { success: true, data: result };
    }
}
