import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { PaymentStatus } from '@prisma/client';

export class CreateFeeStructureDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    amount: number;

    @IsNumber()
    term: number;

    @IsString()
    @IsNotEmpty()
    academicYear: string;

    @IsUUID()
    @IsOptional()
    classId?: string;
}

export class RecordPaymentDto {
    @IsUUID()
    @IsNotEmpty()
    studentId: string;

    @IsUUID()
    @IsNotEmpty()
    feeStructureId: string;

    @IsNumber()
    amountPaid: number;

    @IsString()
    @IsNotEmpty()
    method: string; // e.g., CASH, BANK_TRANSFER, ONLINE

    @IsString()
    @IsNotEmpty()
    reference: string;
}
