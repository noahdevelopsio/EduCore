import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';

@Injectable()
export class AttendanceRepository {
    constructor(private prisma: PrismaService) { }

    async markAttendance(schoolId: string, data: MarkAttendanceDto, recordedById: string) {
        const date = new Date(data.date);

        // Efficiently upsert using a transaction
        return this.prisma.$transaction(
            data.records.map((record) =>
                this.prisma.attendance.upsert({
                    where: {
                        studentId_date: {
                            studentId: record.studentId,
                            date,
                        },
                    },
                    update: {
                        status: record.status,
                        markedById: recordedById,
                    },
                    create: {
                        schoolId,
                        classId: data.classId,
                        studentId: record.studentId,
                        date,
                        status: record.status,
                        markedById: recordedById,
                    },
                })
            )
        );
    }

    async getAttendanceByClassAndDate(schoolId: string, classId: string, date: Date) {
        return this.prisma.attendance.findMany({
            where: {
                schoolId,
                classId,
                date,
            },
            include: {
                student: {
                    select: { id: true, firstName: true, lastName: true, admissionNumber: true }
                }
            }
        });
    }

    async getStudentAttendance(schoolId: string, studentId: string, startDate?: Date, endDate?: Date) {
        const whereClause: any = { schoolId, studentId };

        if (startDate || endDate) {
            whereClause.date = {};
            if (startDate) whereClause.date.gte = startDate;
            if (endDate) whereClause.date.lte = endDate;
        }

        return this.prisma.attendance.findMany({
            where: whereClause,
            orderBy: { date: 'desc' },
        });
    }
}
