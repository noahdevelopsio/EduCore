import { IsString, IsNotEmpty, IsArray, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateAnnouncementDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    body: string;

    @IsArray()
    @IsEnum(Role, { each: true })
    targetRoles: Role[];
}
