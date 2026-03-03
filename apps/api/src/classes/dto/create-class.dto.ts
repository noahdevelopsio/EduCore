import { IsString, IsNotEmpty, IsOptional, MaxLength, IsUUID } from 'class-validator';

export class CreateClassDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(10)
    section?: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    academicYear: string;

    @IsOptional()
    @IsUUID()
    teacherId?: string;
}
