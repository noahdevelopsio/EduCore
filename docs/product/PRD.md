# Product Requirements Document (PRD): EduCore

**Version:** 1.0  
**Date:** March 2026  
**Status:** Draft  
**Product Manager:** [Name]  
**Engineering Lead:** [Name]

---

## 1. Purpose

This document defines the product requirements for EduCore, a school management system for African primary and secondary schools. It serves as the source of truth for design, engineering, and QA teams during development.

---

## 2. Goals & Objectives

### Product Goals
- Deliver an MVP within 3 months covering core admin, attendance, and results features
- Achieve a system uptime of 99.5%
- Support up to 5,000 concurrent users per school instance

### Business Goals
- Onboard 100 paying schools within 12 months of launch
- Achieve $10,000 MRR by month 12
- Maintain churn under 5% monthly

---

## 3. User Personas

### 3.1 School Admin (Primary User)
- **Name:** Mrs. Adaeze
- **Role:** Head Administrator, private secondary school, Lagos
- **Goals:** Manage student records, collect fees, generate reports
- **Pain Points:** Manual data entry, no financial audit trail, slow report card generation
- **Tech Level:** Moderate — uses smartphone daily

### 3.2 Teacher
- **Name:** Mr. Kwame
- **Role:** Class teacher, JHS, Accra
- **Goals:** Mark attendance, upload grades, share resources
- **Pain Points:** Paper attendance registers, manual grade calculations
- **Tech Level:** Moderate

### 3.3 Parent
- **Name:** Fatima
- **Role:** Mother of 2 students, Nairobi
- **Goals:** Know child's attendance, pay fees, see results
- **Pain Points:** No visibility into school activities, manual fee payments
- **Tech Level:** Low-moderate — WhatsApp user

### 3.4 Student
- **Name:** Emeka
- **Role:** SS2 student, Abuja
- **Goals:** Check results, timetable, download class notes
- **Pain Points:** No centralized access to academic info
- **Tech Level:** Moderate-High

---

## 4. Feature Requirements

---

### MODULE 1: Authentication & User Management

#### FR-001: User Registration & Login
- System shall support email/phone number login
- System shall support role-based access: Super Admin, School Admin, Teacher, Student, Parent
- System shall support password reset via email or SMS OTP
- System shall enforce session timeout after 30 minutes of inactivity

#### FR-002: School Onboarding
- Admin shall be able to register a school with: name, logo, address, country, curriculum type
- System shall generate a unique school code for each registered school
- System shall allow bulk import of students and staff via CSV

---

### MODULE 2: Student Records Management

#### FR-003: Student Enrollment
- Admin shall be able to add students manually or via bulk CSV import
- Each student profile shall include: full name, date of birth, gender, class, guardian info, photo, admission number
- System shall auto-generate unique student IDs

#### FR-004: Class & Section Management
- Admin shall be able to create classes (e.g. JSS1, Grade 6) and sections (A, B, C)
- Admin shall be able to assign students and teachers to classes

---

### MODULE 3: Attendance Management

#### FR-005: Teacher Attendance Marking
- Teachers shall be able to mark attendance (present/absent/late) per student per day
- Attendance shall be markable via web and mobile app
- System shall support offline attendance marking with sync on reconnect

#### FR-006: Attendance Notifications
- System shall automatically notify parents via SMS or in-app notification when a child is marked absent
- Admin shall be able to view attendance reports by class, date range, or student

---

### MODULE 4: Results & Grade Management

#### FR-007: Grade Entry
- Teachers shall be able to enter continuous assessment (CA) and exam scores per subject per term
- System shall auto-calculate total scores and grades based on school-defined grading scale
- System shall support multiple grading systems (e.g. A-F, 1-9, percentage)

#### FR-008: Report Card Generation
- System shall auto-generate printable/downloadable report cards per student per term
- Report cards shall include: subject scores, grades, teacher comments, class position, attendance summary
- Admin shall be able to publish report cards for parent viewing

---

### MODULE 5: Fee & Payment Management

#### FR-009: Fee Structure Setup
- Admin shall be able to define fee structures per class per term (tuition, PTA levy, uniform, etc.)
- System shall support one-time and recurring fee types

#### FR-010: Payment Processing
- Parents shall be able to pay fees online via integrated payment gateways (Paystack, Flutterwave, M-Pesa)
- System shall generate digital receipts automatically upon successful payment
- Admin shall be able to view payment history, outstanding balances, and generate financial reports

#### FR-011: Fee Reminders
- System shall send automated payment reminders to parents with outstanding balances
- Admin shall be able to configure reminder schedules

---

### MODULE 6: Communication System

#### FR-012: Announcements
- Admin and teachers shall be able to send school-wide or class-specific announcements
- Announcements shall be delivered via in-app notification, email, and SMS

#### FR-013: Direct Messaging
- Teachers and parents shall be able to exchange direct messages within the platform
- All messages shall be logged and auditable by admin

---

### MODULE 7: Timetable & Scheduling

#### FR-014: Timetable Creation
- Admin shall be able to create weekly class timetables
- System shall detect and flag scheduling conflicts (teacher double-booking, room overlap)
- Timetables shall be visible to students and parents

#### FR-015: Exam Scheduling
- Admin shall be able to create and publish exam timetables
- System shall notify students and parents of upcoming exams

---

### MODULE 8: Learning Resources

#### FR-016: Resource Upload
- Teachers shall be able to upload notes, assignments, and past questions (PDF, DOCX, images)
- Resources shall be organized by class, subject, and term

#### FR-017: Student Access
- Students shall be able to browse and download resources for their class
- System shall track resource downloads per student

---

### MODULE 9: Admin Dashboard & Reporting

#### FR-018: Dashboard Overview
- Admin shall see a real-time dashboard showing: total students, attendance rate today, fees collected this term, pending payments, recent announcements
- Dashboard shall be role-sensitive (school owner sees financial summary; teacher sees class-level data)

#### FR-019: Reports
- System shall generate exportable reports (PDF/Excel): attendance, academic performance, financial summary, enrollment statistics

---

## 5. Non-Functional Requirements

| Requirement | Specification |
|-------------|--------------|
| Performance | Page load < 3 seconds on 3G |
| Availability | 99.5% uptime SLA |
| Scalability | Support 10,000+ students per school instance |
| Security | End-to-end encryption, GDPR-adjacent data handling |
| Offline | Core features work offline with background sync |
| Mobile | Fully responsive; PWA-first, native apps in Phase 2 |
| Accessibility | WCAG 2.1 AA compliance |
| Localization | Multi-language support (English, French, Swahili) |

---

## 6. MVP Scope (Phase 1)

| Feature | Include in MVP? |
|---------|----------------|
| Authentication & User Management | ✅ Yes |
| Student Records | ✅ Yes |
| Attendance Tracking | ✅ Yes |
| Results & Report Cards | ✅ Yes |
| Fee Tracking (manual + basic online) | ✅ Yes |
| Admin Dashboard | ✅ Yes |
| Communication (announcements only) | ✅ Yes |
| Timetable | ❌ Phase 2 |
| Learning Resources | ❌ Phase 2 |
| Direct Messaging | ❌ Phase 2 |
| Native Mobile Apps | ❌ Phase 3 |

---

## 7. Out of Scope (v1.0)

- E-learning / LMS features
- HR & payroll for staff
- Library management
- Transport management
- Hostel/boarding management

---

## 8. Acceptance Criteria Summary

Each feature is considered complete when:
1. Functional requirements pass QA testing
2. Works on Chrome, Firefox, Safari (desktop + mobile)
3. Loads in < 3s on simulated 3G
4. Passes basic accessibility audit
5. Data is correctly persisted and retrievable

---

## 9. Dependencies

- Payment gateway partnerships: Paystack, Flutterwave, M-Pesa
- SMS provider: Termii, Africa's Talking, or Twilio
- Cloud hosting: AWS or GCP (African region preferred)
- Email service: SendGrid or Mailgun

---

## 10. Timeline (Indicative)

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Discovery & Design | 3 weeks | Wireframes, DB schema, API contracts |
| MVP Development | 10 weeks | Working MVP |
| Beta Testing | 3 weeks | 5–10 pilot schools |
| Public Launch | Week 17 | Full launch |

---

*Document Owner: Product Team | Last Updated: March 2026*
