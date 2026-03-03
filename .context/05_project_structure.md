# EduCore — Project Structure & Database Schema

## Folder Structure

### Backend (NestJS) — `apps/api/src/`
```
apps/api/src/
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/jwt.strategy.ts
│   ├── strategies/refresh.strategy.ts
│   └── guards/roles.guard.ts
├── schools/
├── students/
├── classes/
├── attendance/
├── grades/
├── fees/
├── notifications/
├── announcements/
├── common/
│   ├── decorators/roles.decorator.ts
│   ├── filters/http-exception.filter.ts
│   ├── interceptors/response.interceptor.ts
│   └── pipes/validation.pipe.ts
├── prisma/prisma.service.ts
└── main.ts
```

### Frontend (Next.js) — `apps/web/src/`
```
apps/web/src/
├── app/
│   ├── (auth)/login/page.tsx
│   ├── (auth)/register/page.tsx
│   ├── (dashboard)/admin/page.tsx
│   ├── (dashboard)/teacher/page.tsx
│   ├── (dashboard)/parent/page.tsx
│   ├── (dashboard)/student/page.tsx
│   └── layout.tsx
├── components/
│   ├── ui/          ← Button, Input, Card, Badge, Modal, Table
│   ├── forms/       ← StudentForm, AttendanceForm, GradeForm
│   ├── tables/      ← StudentTable, AttendanceTable, FeeTable
│   └── charts/      ← AttendanceChart, GradeChart
├── hooks/           ← useStudents, useAttendance, useFees
├── lib/
│   ├── api.ts       ← Axios instance with interceptors
│   ├── auth.ts      ← Auth helpers
│   └── offline.ts   ← IndexedDB helpers for offline
├── stores/          ← Zustand: authStore, schoolStore
├── styles/globals.css  ← CSS variables from design system
└── types/           ← Shared TypeScript interfaces
```

## Database Schema (Prisma)

```prisma
// Key models — generate full schema from these

model School {
  id           String   @id @default(uuid())
  name         String
  code         String   @unique
  country      String
  currency     String   @default("NGN")
  logoUrl      String?
  tier         String   @default("starter") // starter | growth | pro
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model User {
  id           String   @id @default(uuid())
  schoolId     String
  role         Role     // SUPER_ADMIN | SCHOOL_ADMIN | TEACHER | PARENT | STUDENT
  email        String?
  phone        String?
  passwordHash String
  createdAt    DateTime @default(now())
  deletedAt    DateTime?
}

model Student {
  id              String   @id @default(uuid())
  schoolId        String
  admissionNumber String
  firstName       String
  lastName        String
  dateOfBirth     DateTime
  gender          String
  classId         String
  guardianId      String?  // FK to User (parent)
  photoUrl        String?
  createdAt       DateTime @default(now())
  deletedAt       DateTime?
}

model Class {
  id           String   @id @default(uuid())
  schoolId     String
  name         String   // e.g. "JSS1", "Grade 6"
  section      String?  // e.g. "A", "B"
  academicYear String
  teacherId    String?
}

model Attendance {
  id         String           @id @default(uuid())
  schoolId   String
  studentId  String
  classId    String
  date       DateTime
  status     AttendanceStatus // PRESENT | ABSENT | LATE
  markedById String
  syncedAt   DateTime?        // null = pending offline sync
  createdAt  DateTime         @default(now())

  @@unique([studentId, date])
}

model Subject {
  id       String @id @default(uuid())
  schoolId String
  name     String
  classId  String
  teacherId String
}

model Grade {
  id         String  @id @default(uuid())
  schoolId   String
  studentId  String
  subjectId  String
  term       Int     // 1, 2, 3
  year       Int
  caScore    Float?
  examScore  Float?
  total      Float?
  grade      String? // A, B, C etc.
  createdAt  DateTime @default(now())

  @@unique([studentId, subjectId, term, year])
}

model FeeStructure {
  id           String  @id @default(uuid())
  schoolId     String
  classId      String?
  name         String  // "Tuition", "PTA Levy"
  amount       Float
  term         Int
  academicYear String
}

model FeePayment {
  id              String        @id @default(uuid())
  schoolId        String
  studentId       String
  feeStructureId  String
  amountPaid      Float
  paymentDate     DateTime
  method          String        // paystack | flutterwave | mpesa | cash
  reference       String        @unique
  status          PaymentStatus // PENDING | SUCCESS | FAILED | REFUNDED
  createdAt       DateTime      @default(now())
}

model Announcement {
  id          String   @id @default(uuid())
  schoolId    String
  title       String
  body        String
  targetRoles Role[]   // who can see this
  createdById String
  createdAt   DateTime @default(now())
}

enum Role {
  SUPER_ADMIN
  SCHOOL_ADMIN
  TEACHER
  PARENT
  STUDENT
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
  REFUNDED
}
```

## API Base URL & Conventions
```
Base:    /api/v1/
Auth:    Bearer token in Authorization header

Key endpoints:
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
GET    /api/v1/schools/:schoolId/students
POST   /api/v1/classes/:classId/attendance
GET    /api/v1/students/:studentId/report-card
POST   /api/v1/fees/initialize-payment
POST   /api/v1/payments/webhook/paystack
GET    /api/v1/schools/:schoolId/dashboard
```

## Environment Variables (Required)
```
DATABASE_URL, REDIS_URL
JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
PAYSTACK_SECRET_KEY, PAYSTACK_WEBHOOK_SECRET
FLUTTERWAVE_SECRET_KEY, FLUTTERWAVE_WEBHOOK_SECRET
AT_API_KEY, AT_USERNAME (Africa's Talking SMS)
SENDGRID_API_KEY, EMAIL_FROM
FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
ENCRYPTION_KEY (32 chars, for PII encryption)
```

## Offline Strategy (Frontend)
```
Library: idb (IndexedDB wrapper)
Cache:   student lists, attendance records, timetable, own results
Queue:   mutations stored locally when offline → flushed on reconnect
Conflict: server timestamp wins for attendance; prompt user for grade conflicts
UI cue:  always show "Offline — changes will sync" banner when navigator.onLine = false
```
