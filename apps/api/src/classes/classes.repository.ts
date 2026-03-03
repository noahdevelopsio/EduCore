import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesRepository {
    constructor(private prisma: PrismaService) { }

    async create(schoolId: string, data: CreateClassDto) {
        return this.prisma.class.create({
            data: { ...data, schoolId },
        });
    }

    async findAll(schoolId: string) {
        return this.prisma.class.findMany({
            where: { schoolId },
            orderBy: { name: 'asc' },
        });
    }

    async findById(id: string, schoolId: string) {
        return this.prisma.class.findFirst({
            where: { id, schoolId },
        });
    }

    async update(id: string, schoolId: string, data: UpdateClassDto) {
        // using updateMany to scope by schoolId safely, but usually update is needed for return value
        // we'll find first to ensure it exists, then update
        const existing = await this.findById(id, schoolId);
        if (!existing) return null;

        return this.prisma.class.update({
            where: { id },
            data,
        });
    }

    async remove(id: string, schoolId: string) {
        const existing = await this.findById(id, schoolId);
        if (!existing) return null;

        return this.prisma.class.delete({
            where: { id },
        });
    }
}
