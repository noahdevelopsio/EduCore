import { IsString, IsOptional, MaxLength, IsDateString, IsUUID } from 'class-validator';

export class UpdateStudentDto {
    @IsString()
    @IsOptional()
    @MaxLength(100)
    firstName?: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    lastName?: string;

    @IsString()
    @IsOptional()
    @MaxLength(50)
    admissionNumber?: string;

    @IsDateString()
    @IsOptional()
    dateOfBirth?: string;

    @IsString()
    @IsOptional()
    @MaxLength(20)
    gender?: string;

    @IsUUID()
    @IsOptional()
    classId?: string;

    @IsUUID()
    @IsOptional()
    guardianId?: string;

    @IsString()
    @IsOptional()
    photoUrl?: string;
}
