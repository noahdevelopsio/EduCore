import { Injectable, NotFoundException } from '@nestjs/common';
import { GradesRepository } from './grades.repository';
import { SaveGradesDto } from './dto/save-grades.dto';

@Injectable()
export class GradesService {
    constructor(private readonly gradesRepo: GradesRepository) { }

    async saveGrades(schoolId: string, data: SaveGradesDto) {
        return this.gradesRepo.saveGrades(schoolId, data);
    }

    async getGradesBySubject(schoolId: string, subjectId: string, term: number, year: number) {
        return this.gradesRepo.getGradesBySubject(schoolId, subjectId, term, year);
    }

    async generateReportCard(schoolId: string, studentId: string, term: number, year: number) {
        const data = await this.gradesRepo.getStudentReportCard(schoolId, studentId, term, year);
        if (!data.student) throw new NotFoundException('Student not found');
        return data;
    }
}
