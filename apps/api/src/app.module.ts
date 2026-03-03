import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ClassesModule } from './classes/classes.module';
import { StudentsModule } from './students/students.module';
import { AttendanceModule } from './attendance/attendance.module';
import { SubjectsModule } from './subjects/subjects.module';
import { GradesModule } from './grades/grades.module';
import { FeesModule } from './fees/fees.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AuthModule, ClassesModule, StudentsModule, AttendanceModule, SubjectsModule, GradesModule, FeesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
