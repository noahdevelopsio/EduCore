import { Controller, Get, Post, Body, Param, Query, Req, UseGuards, Res } from '@nestjs/common';
import { GradesService } from './grades.service';
import { SaveGradesDto } from './dto/save-grades.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import type { Response } from 'express';
import PDFDocument from 'pdfkit';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('grades')
export class GradesController {
    constructor(private readonly gradesService: GradesService) { }

    @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.TEACHER)
    @Post()
    async saveGrades(@Req() req: any, @Body() saveGradesDto: SaveGradesDto) {
        const schoolId = req.user.schoolId;
        const data = await this.gradesService.saveGrades(schoolId, saveGradesDto);
        return { success: true, data, message: 'Grades saved successfully' };
    }

    @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN, Role.TEACHER)
    @Get('subject/:subjectId')
    async getGradesBySubject(
        @Req() req: any,
        @Param('subjectId') subjectId: string,
        @Query('term') term: string,
        @Query('year') year: string
    ) {
        const schoolId = req.user.schoolId;
        const data = await this.gradesService.getGradesBySubject(schoolId, subjectId, Number(term), Number(year));
        return { success: true, data, message: 'Grades retrieved successfully' };
    }

    @Get('report-card/:studentId')
    async getReportCard(
        @Req() req: any,
        @Param('studentId') studentId: string,
        @Query('term') term: string,
        @Query('year') year: string
    ) {
        const schoolId = req.user.schoolId;
        const data = await this.gradesService.generateReportCard(schoolId, studentId, Number(term), Number(year));
        return { success: true, data, message: 'Report card computed' };
    }

    @Get('report-card/:studentId/pdf')
    async downloadReportCardPdf(
        @Req() req: any,
        @Param('studentId') studentId: string,
        @Query('term') term: string,
        @Query('year') year: string,
        @Res() res: Response
    ) {
        const schoolId = req.user.schoolId;
        const reportData = await this.gradesService.generateReportCard(schoolId, studentId, Number(term), Number(year));

        // Basic PDF Generation
        const doc = new PDFDocument({ margin: 50 });

        // Set headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="report-card-${studentId}-${term}-${year}.pdf"`);

        // Pipe PDF to response
        doc.pipe(res);

        // Document Content
        doc.fontSize(20).text('Student Report Card', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Student Name: ${reportData.student!.firstName} ${reportData.student!.lastName}`);
        doc.text(`Admission Number: ${reportData.student!.admissionNumber}`);
        doc.text(`Class: ${(reportData.student!.class as any)?.name}`);
        doc.text(`Term: ${term}     Academic Year: ${year}`);
        doc.moveDown();

        // Table Header
        doc.font('Helvetica-Bold');
        doc.text('Subject', 50, 180);
        doc.text('C.A.', 250, 180);
        doc.text('Exam', 320, 180);
        doc.text('Total', 390, 180);
        doc.text('Grade', 460, 180);
        doc.font('Helvetica');

        let yPosition = 210;
        for (const grade of reportData.grades) {
            doc.text((grade.subject as any).name, 50, yPosition);
            doc.text(grade.caScore?.toString() || '-', 250, yPosition);
            doc.text(grade.examScore?.toString() || '-', 320, yPosition);
            doc.text(grade.total?.toString() || '-', 390, yPosition);
            doc.text(grade.grade || '-', 460, yPosition);
            yPosition += 25;
        }

        doc.end();
    }
}
