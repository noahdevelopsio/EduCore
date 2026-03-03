import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ClassesModule } from './classes/classes.module';
import { StudentsModule } from './students/students.module';
import { AttendanceModule } from './attendance/attendance.module';
import { SubjectsModule } from './subjects/subjects.module';
import { GradesModule } from './grades/grades.module';
import { FeesModule } from './fees/fees.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { BullModule } from '@nestjs/bullmq';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
    AuthModule, ClassesModule, StudentsModule, AttendanceModule, SubjectsModule, GradesModule, FeesModule, NotificationsModule, AnnouncementsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
