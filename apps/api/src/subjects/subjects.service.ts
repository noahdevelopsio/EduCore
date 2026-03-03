import { Injectable } from '@nestjs/common';
import { SubjectsRepository } from './subjects.repository';
import { CreateSubjectDto } from './dto/create-subject.dto';

@Injectable()
export class SubjectsService {
    constructor(private readonly subjectsRepo: SubjectsRepository) { }

    async create(schoolId: string, createSubjectDto: CreateSubjectDto) {
        return this.subjectsRepo.create(schoolId, createSubjectDto);
    }

    async findAll(schoolId: string) {
        return this.subjectsRepo.findAll(schoolId);
    }
}
