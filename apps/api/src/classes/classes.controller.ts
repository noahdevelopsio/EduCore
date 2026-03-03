import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('classes')
export class ClassesController {
    constructor(private readonly classesService: ClassesService) { }

    @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
    @Post()
    async create(@Req() req: any, @Body() createClassDto: CreateClassDto) {
        const schoolId = req.user.schoolId;
        const data = await this.classesService.create(schoolId, createClassDto);
        return { success: true, data, message: 'Class created successfully' };
    }

    @Get()
    async findAll(@Req() req: any) {
        const schoolId = req.user.schoolId;
        const data = await this.classesService.findAll(schoolId);
        return { success: true, data, message: 'Classes retrieved successfully' };
    }

    @Get(':id')
    async findOne(@Req() req: any, @Param('id') id: string) {
        const schoolId = req.user.schoolId;
        const data = await this.classesService.findOne(id, schoolId);
        return { success: true, data, message: 'Class retrieved successfully' };
    }

    @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
    @Patch(':id')
    async update(@Req() req: any, @Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
        const schoolId = req.user.schoolId;
        const data = await this.classesService.update(id, schoolId, updateClassDto);
        return { success: true, data, message: 'Class updated successfully' };
    }

    @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
    @Delete(':id')
    async remove(@Req() req: any, @Param('id') id: string) {
        const schoolId = req.user.schoolId;
        const data = await this.classesService.remove(id, schoolId);
        return { success: true, data, message: 'Class deleted successfully' };
    }
}
