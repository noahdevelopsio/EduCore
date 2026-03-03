import { IsString, IsNotEmpty, IsOptional, MaxLength, IsDateString, IsUUID } from 'class-validator';

export class CreateStudentDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    lastName: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    admissionNumber: string;

    @IsDateString()
    @IsNotEmpty()
    dateOfBirth: string; // Will cast to Date

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    gender: string;

    @IsUUID()
    @IsNotEmpty()
    classId: string;

    @IsUUID()
    @IsOptional()
    guardianId?: string;

    @IsString()
    @IsOptional()
    photoUrl?: string;
}
