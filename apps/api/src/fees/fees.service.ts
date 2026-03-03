import { Injectable } from '@nestjs/common';
import { FeesRepository } from './fees.repository';
import { CreateFeeStructureDto, RecordPaymentDto } from './dto/fees.dto';

@Injectable()
export class FeesService {
    constructor(private readonly feesRepo: FeesRepository) { }

    async createStructure(schoolId: string, data: CreateFeeStructureDto) {
        return this.feesRepo.createStructure(schoolId, data);
    }

    async findAllStructures(schoolId: string) {
        return this.feesRepo.findAllStructures(schoolId);
    }

    async recordPayment(schoolId: string, data: RecordPaymentDto) {
        return this.feesRepo.recordPayment(schoolId, data);
    }

    async getPayments(schoolId: string, studentId?: string) {
        return this.feesRepo.getPayments(schoolId, { studentId });
    }

    async getDashboardStats(schoolId: string) {
        return this.feesRepo.getDashboardStats(schoolId);
    }
}
