import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('students')
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) { }

    @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
    @Post()
    async create(@Req() req: any, @Body() createStudentDto: CreateStudentDto) {
        const schoolId = req.user.schoolId;
        const data = await this.studentsService.create(schoolId, createStudentDto);
        return { success: true, data, message: 'Student created successfully' };
    }

    @Get()
    async findAll(@Req() req: any) {
        const schoolId = req.user.schoolId;
        const data = await this.studentsService.findAll(schoolId);
        return { success: true, data, message: 'Students retrieved successfully' };
    }

    @Get(':id')
    async findOne(@Req() req: any, @Param('id') id: string) {
        const schoolId = req.user.schoolId;
        // NOTE: For teacher, we might need extra service-level validation here to ensure student belongs to one of their classes
        const data = await this.studentsService.findOne(id, schoolId);
        return { success: true, data, message: 'Student retrieved successfully' };
    }

    @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
    @Patch(':id')
    async update(@Req() req: any, @Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
        const schoolId = req.user.schoolId;
        const data = await this.studentsService.update(id, schoolId, updateStudentDto);
        return { success: true, data, message: 'Student updated successfully' };
    }

    @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
    @Delete(':id')
    async remove(@Req() req: any, @Param('id') id: string) {
        const schoolId = req.user.schoolId;
        const data = await this.studentsService.remove(id, schoolId);
        return { success: true, data, message: 'Student deleted successfully' };
    }
}
