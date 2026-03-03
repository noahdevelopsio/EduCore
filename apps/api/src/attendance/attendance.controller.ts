import { Controller, Get, Post, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('attendance')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.TEACHER)
    @Post('mark')
    async markAttendance(@Req() req: any, @Body() markAttendanceDto: MarkAttendanceDto) {
        const schoolId = req.user.schoolId;
        const recordedById = req.user.sub;
        const data = await this.attendanceService.markAttendance(schoolId, markAttendanceDto, recordedById);
        return { success: true, data, message: 'Attendance marked successfully' };
    }

    @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.TEACHER)
    @Get('class/:classId')
    async getByClassAndDate(@Req() req: any, @Param('classId') classId: string, @Query('date') date: string) {
        const schoolId = req.user.schoolId;
        // Defaults to today if date query is not provided
        const targetDate = date || new Date().toISOString().split('T')[0];
        const data = await this.attendanceService.getAttendanceByClassAndDate(schoolId, classId, targetDate);
        return { success: true, data, message: 'Attendance records retrieved' };
    }

    @Get('student/:studentId')
    async getStudentAttendance(
        @Req() req: any,
        @Param('studentId') studentId: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ) {
        const schoolId = req.user.schoolId;
        // Parent logic would normally restrict them to their own students here
        const data = await this.attendanceService.getStudentAttendance(schoolId, studentId, startDate, endDate);
        return { success: true, data, message: 'Student attendance retrieved' };
    }
}
