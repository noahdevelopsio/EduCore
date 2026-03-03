import { Injectable, NotFoundException } from '@nestjs/common';
import { StudentsRepository } from './students.repository';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
    constructor(private readonly studentsRepo: StudentsRepository) { }

    async create(schoolId: string, createStudentDto: CreateStudentDto) {
        return this.studentsRepo.create(schoolId, createStudentDto);
    }

    async findAll(schoolId: string) {
        return this.studentsRepo.findAll(schoolId);
    }

    async findOne(id: string, schoolId: string) {
        const student = await this.studentsRepo.findById(id, schoolId);
        if (!student) {
            throw new NotFoundException(`Student with ID ${id} not found`);
        }
        return student;
    }

    async update(id: string, schoolId: string, updateStudentDto: UpdateStudentDto) {
        const updated = await this.studentsRepo.update(id, schoolId, updateStudentDto);
        if (!updated) {
            throw new NotFoundException(`Student with ID ${id} not found`);
        }
        return updated;
    }

    async remove(id: string, schoolId: string) {
        const removed = await this.studentsRepo.remove(id, schoolId);
        if (!removed) {
            throw new NotFoundException(`Student with ID ${id} not found`);
        }
        return removed;
    }
}
