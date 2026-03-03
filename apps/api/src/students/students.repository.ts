import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsRepository {
    constructor(private prisma: PrismaService) { }

    async create(schoolId: string, data: CreateStudentDto) {
        return this.prisma.student.create({
            data: {
                ...data,
                dateOfBirth: new Date(data.dateOfBirth),
                schoolId
            },
        });
    }

    async findAll(schoolId: string) {
        return this.prisma.student.findMany({
            where: { schoolId, deletedAt: null },
            orderBy: { lastName: 'asc' },
        });
    }

    async findById(id: string, schoolId: string) {
        return this.prisma.student.findFirst({
            where: { id, schoolId, deletedAt: null },
        });
    }

    async update(id: string, schoolId: string, data: UpdateStudentDto) {
        const existing = await this.findById(id, schoolId);
        if (!existing) return null;

        return this.prisma.student.update({
            where: { id },
            data: {
                ...data,
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
            },
        });
    }

    async remove(id: string, schoolId: string) {
        const existing = await this.findById(id, schoolId);
        if (!existing) return null;

        // Use soft delete
        return this.prisma.student.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}
