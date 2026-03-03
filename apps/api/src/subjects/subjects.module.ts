import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { SubjectsRepository } from './subjects.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [SubjectsController],
    providers: [SubjectsService, SubjectsRepository, PrismaService],
    exports: [SubjectsService],
})
export class SubjectsModule { }
