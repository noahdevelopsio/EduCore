import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus } from '@prisma/client';

export class AttendanceRecordDto {
    @IsUUID()
    @IsNotEmpty()
    studentId: string;

    @IsEnum(AttendanceStatus)
    @IsNotEmpty()
    status: AttendanceStatus;
}

export class MarkAttendanceDto {
    @IsUUID()
    @IsNotEmpty()
    classId: string;

    @IsDateString()
    @IsNotEmpty()
    date: string; // Cast to date

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AttendanceRecordDto)
    records: AttendanceRecordDto[];
}
