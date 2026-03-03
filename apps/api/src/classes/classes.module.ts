import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { ClassesRepository } from './classes.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [ClassesController],
    providers: [ClassesService, ClassesRepository, PrismaService],
    exports: [ClassesService],
})
export class ClassesModule { }
