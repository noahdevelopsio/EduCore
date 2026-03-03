import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('subjects')
export class SubjectsController {
    constructor(private readonly subjectsService: SubjectsService) { }

    @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
    @Post()
    async create(@Req() req: any, @Body() createSubjectDto: CreateSubjectDto) {
        const schoolId = req.user.schoolId;
        const data = await this.subjectsService.create(schoolId, createSubjectDto);
        return { success: true, data, message: 'Subject created successfully' };
    }

    @Get()
    async findAll(@Req() req: any) {
        const schoolId = req.user.schoolId;
        const data = await this.subjectsService.findAll(schoolId);
        return { success: true, data, message: 'Subjects retrieved successfully' };
    }
}
