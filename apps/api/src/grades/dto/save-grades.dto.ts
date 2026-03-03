import { IsUUID, IsNumber, IsOptional, Max, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class GradeRecordDto {
    @IsUUID()
    studentId: string;

    @IsNumber()
    @Min(0)
    @Max(40)
    @IsOptional()
    caScore?: number;

    @IsNumber()
    @Min(0)
    @Max(100) // Usually 60, but leaving 100 for safety based on various region configs
    @IsOptional()
    examScore?: number;
}

export class SaveGradesDto {
    @IsUUID()
    subjectId: string;

    @IsNumber()
    @Min(1)
    @Max(3)
    term: number;

    @IsNumber()
    year: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GradeRecordDto)
    records: GradeRecordDto[];
}
