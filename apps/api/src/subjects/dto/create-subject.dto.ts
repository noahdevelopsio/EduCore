import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSubjectDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsUUID()
    @IsNotEmpty()
    classId: string;

    @IsUUID()
    @IsNotEmpty()
    teacherId: string;
}
