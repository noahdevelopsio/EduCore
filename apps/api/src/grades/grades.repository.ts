import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaveGradesDto } from './dto/save-grades.dto';

@Injectable()
export class GradesRepository {
    constructor(private prisma: PrismaService) { }

    private calculateGrade(total: number): string {
        if (total >= 70) return 'A';
        if (total >= 60) return 'B';
        if (total >= 50) return 'C';
        if (total >= 40) return 'D';
        return 'F';
    }

    async saveGrades(schoolId: string, data: SaveGradesDto) {
        return this.prisma.$transaction(
            data.records.map((record) => {
                const caScore = record.caScore || 0;
                const examScore = record.examScore || 0;
                const total = caScore + examScore;
                const gradeLetter = this.calculateGrade(total);

                return this.prisma.grade.upsert({
                    where: {
                        studentId_subjectId_term_year: {
                            studentId: record.studentId,
                            subjectId: data.subjectId,
                            term: data.term,
                            year: data.year,
                        },
                    },
                    update: {
                        caScore: record.caScore,
                        examScore: record.examScore,
                        total,
                        grade: gradeLetter,
                    },
                    create: {
                        schoolId,
                        studentId: record.studentId,
                        subjectId: data.subjectId,
                        term: data.term,
                        year: data.year,
                        caScore: record.caScore,
                        examScore: record.examScore,
                        total,
                        grade: gradeLetter,
                    },
                });
            })
        );
    }

    async getGradesBySubject(schoolId: string, subjectId: string, term: number, year: number) {
        return this.prisma.grade.findMany({
            where: {
                schoolId,
                subjectId,
                term,
                year,
            },
            include: {
                student: {
                    select: { id: true, firstName: true, lastName: true, admissionNumber: true }
                }
            }
        });
    }

    async getStudentReportCard(schoolId: string, studentId: string, term: number, year: number) {
        const grades = await this.prisma.grade.findMany({
            where: { schoolId, studentId, term, year },
            include: {
                subject: { select: { name: true } }
            }
        });

        const student = await this.prisma.student.findUnique({
            where: { id: studentId },
            include: { class: { select: { name: true } } }
        });

        return { student, grades };
    }
}
