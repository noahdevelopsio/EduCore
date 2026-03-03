import { Module } from '@nestjs/common';
import { GradesService } from './grades.service';
import { GradesController } from './grades.controller';
import { GradesRepository } from './grades.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [GradesController],
    providers: [GradesService, GradesRepository, PrismaService],
    exports: [GradesService],
})
export class GradesModule { }
