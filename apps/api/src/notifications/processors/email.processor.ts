import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('email-queue')
export class EmailProcessor extends WorkerHost {
    private readonly logger = new Logger(EmailProcessor.name);

    async process(job: Job<any, any, string>): Promise<any> {
        this.logger.debug(`Processing email job ${job.id} for target roles: ${job.data.targetRoles}`);

        // Simulate email sending delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        this.logger.log(`>> [SIMULATION] Sent Email Notification: "${job.data.title}" to ${job.data.targetRoles}`);
        return {};
    }
}
