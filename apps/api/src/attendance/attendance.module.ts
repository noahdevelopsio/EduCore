import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { AttendanceRepository } from './attendance.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [AttendanceController],
    providers: [AttendanceService, AttendanceRepository, PrismaService],
    exports: [AttendanceService],
})
export class AttendanceModule { }
