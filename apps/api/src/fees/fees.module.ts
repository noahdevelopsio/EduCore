import { Module } from '@nestjs/common';
import { FeesService } from './fees.service';
import { FeesController } from './fees.controller';
import { FeesRepository } from './fees.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [FeesController],
    providers: [FeesService, FeesRepository, PrismaService],
    exports: [FeesService],
})
export class FeesModule { }
