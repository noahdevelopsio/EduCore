import { Controller, Get, Post, Body, Req, UseGuards, Query } from '@nestjs/common';
import { FeesService } from './fees.service';
import { CreateFeeStructureDto, RecordPaymentDto } from './dto/fees.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('fees')
export class FeesController {
    constructor(private readonly feesService: FeesService) { }

    @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
    @Post('structure')
    async createStructure(@Req() req: any, @Body() data: CreateFeeStructureDto) {
        const schoolId = req.user.schoolId;
        const result = await this.feesService.createStructure(schoolId, data);
        return { success: true, data: result, message: 'Fee structure created' };
    }

    @Get('structures')
    async getStructures(@Req() req: any) {
        const schoolId = req.user.schoolId;
        const result = await this.feesService.findAllStructures(schoolId);
        return { success: true, data: result };
    }

    @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
    @Post('payment')
    async recordPayment(@Req() req: any, @Body() data: RecordPaymentDto) {
        const schoolId = req.user.schoolId;
        const result = await this.feesService.recordPayment(schoolId, data);
        return { success: true, data: result, message: 'Payment recorded successfully' };
    }

    @Get('payments')
    async getPayments(@Req() req: any, @Query('studentId') studentId?: string) {
        const schoolId = req.user.schoolId;
        const result = await this.feesService.getPayments(schoolId, studentId);
        return { success: true, data: result };
    }

    @Get('stats')
    async getStats(@Req() req: any) {
        const schoolId = req.user.schoolId;
        const result = await this.feesService.getDashboardStats(schoolId);
        return { success: true, data: result };
    }
}
