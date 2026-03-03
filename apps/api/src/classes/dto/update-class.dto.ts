import { IsString, IsOptional, MaxLength, IsUUID } from 'class-validator';

export class UpdateClassDto {
    @IsString()
    @IsOptional()
    @MaxLength(100)
    name?: string;

    @IsString()
    @IsOptional()
    @MaxLength(10)
    section?: string;

    @IsString()
    @IsOptional()
    @MaxLength(20)
    academicYear?: string;

    @IsOptional()
    @IsUUID()
    teacherId?: string;
}
