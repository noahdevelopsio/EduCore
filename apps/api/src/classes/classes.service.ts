import { Injectable, NotFoundException } from '@nestjs/common';
import { ClassesRepository } from './classes.repository';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
    constructor(private readonly classesRepo: ClassesRepository) { }

    async create(schoolId: string, createClassDto: CreateClassDto) {
        return this.classesRepo.create(schoolId, createClassDto);
    }

    async findAll(schoolId: string) {
        return this.classesRepo.findAll(schoolId);
    }

    async findOne(id: string, schoolId: string) {
        const classData = await this.classesRepo.findById(id, schoolId);
        if (!classData) {
            throw new NotFoundException(`Class with ID ${id} not found`);
        }
        return classData;
    }

    async update(id: string, schoolId: string, updateClassDto: UpdateClassDto) {
        const updated = await this.classesRepo.update(id, schoolId, updateClassDto);
        if (!updated) {
            throw new NotFoundException(`Class with ID ${id} not found`);
        }
        return updated;
    }

    async remove(id: string, schoolId: string) {
        const removed = await this.classesRepo.remove(id, schoolId);
        if (!removed) {
            throw new NotFoundException(`Class with ID ${id} not found`);
        }
        return removed;
    }
}
