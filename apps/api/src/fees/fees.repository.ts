import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeeStructureDto, RecordPaymentDto } from './dto/fees.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class FeesRepository {
    constructor(private prisma: PrismaService) { }

    async createStructure(schoolId: string, data: CreateFeeStructureDto) {
        return this.prisma.feeStructure.create({
            data: { ...data, schoolId },
        });
    }

    async findAllStructures(schoolId: string) {
        return this.prisma.feeStructure.findMany({
            where: { schoolId },
            include: { class: { select: { name: true } } },
            orderBy: { createdAt: 'desc' } as any,
        } as any);
    }

    async recordPayment(schoolId: string, data: RecordPaymentDto) {
        return this.prisma.feePayment.create({
            data: {
                ...data,
                schoolId,
                status: PaymentStatus.SUCCESS, // Default to success for manual recording
                paymentDate: new Date(),
            },
        });
    }

    async getPayments(schoolId: string, filters: { studentId?: string, feeStructureId?: string }) {
        return this.prisma.feePayment.findMany({
            where: {
                schoolId,
                ...filters,
            },
            include: {
                student: { select: { firstName: true, lastName: true, admissionNumber: true } },
                feeStructure: { select: { name: true, amount: true } },
            },
            orderBy: { createdAt: 'desc' } as any,
        } as any);
    }

    async getDashboardStats(schoolId: string) {
        const totalStudents = await this.prisma.student.count({ where: { schoolId, deletedAt: null } });
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendanceToday = await this.prisma.attendance.count({
            where: { schoolId, date: today, status: 'PRESENT' },
        });

        const totalFeesCollected = await this.prisma.feePayment.aggregate({
            where: { schoolId, status: PaymentStatus.SUCCESS },
            _sum: { amountPaid: true },
        });

        return {
            totalStudents,
            attendanceToday,
            totalFeesCollected: totalFeesCollected._sum.amountPaid || 0,
        };
    }
}
