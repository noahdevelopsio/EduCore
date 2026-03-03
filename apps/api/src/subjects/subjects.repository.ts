import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';

@Injectable()
export class SubjectsRepository {
    constructor(private prisma: PrismaService) { }

    async create(schoolId: string, data: CreateSubjectDto) {
        return this.prisma.subject.create({
            data: { ...data, schoolId },
        });
    }

    async findAll(schoolId: string) {
        return this.prisma.subject.findMany({
            where: { schoolId },
            include: {
                class: { select: { name: true } }
            },
            orderBy: { name: 'asc' },
        });
    }
}
