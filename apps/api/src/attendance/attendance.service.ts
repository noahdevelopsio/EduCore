import { Injectable } from '@nestjs/common';
import { AttendanceRepository } from './attendance.repository';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';

@Injectable()
export class AttendanceService {
    constructor(private readonly attendanceRepo: AttendanceRepository) { }

    async markAttendance(schoolId: string, markAttendanceDto: MarkAttendanceDto, recordedById: string) {
        return this.attendanceRepo.markAttendance(schoolId, markAttendanceDto, recordedById);
    }

    async getAttendanceByClassAndDate(schoolId: string, classId: string, dateString: string) {
        const date = new Date(dateString);
        return this.attendanceRepo.getAttendanceByClassAndDate(schoolId, classId, date);
    }

    async getStudentAttendance(schoolId: string, studentId: string, startDate?: string, endDate?: string) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.attendanceRepo.getStudentAttendance(schoolId, studentId, start, end);
    }
}
