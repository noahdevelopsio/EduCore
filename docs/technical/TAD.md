# Technical Architecture Document (TAD): EduCore

**Version:** 1.0  
**Date:** March 2026  
**Status:** Draft  
**Architecture Owner:** [Engineering Lead]

---

## 1. System Overview

EduCore is a multi-tenant, cloud-native SaaS platform. Each school is an isolated tenant sharing the same infrastructure but with strict data separation. The system is built as a web-first Progressive Web App (PWA) with a RESTful/GraphQL API backend.

---

## 2. Architecture Style

**Multi-Tenant SaaS with Modular Monolith → Microservices path**

Start with a modular monolith for speed of development, designed with clear module boundaries so individual services can be extracted into microservices as scale demands.

```
┌─────────────────────────────────────────────────┐
│                  CLIENT LAYER                    │
│   Web App (PWA)  │  Mobile App (Phase 3)         │
└────────────────────────┬────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────┐
│                   API GATEWAY                    │
│        (Rate Limiting, Auth, Routing)            │
└────────────────────────┬────────────────────────┘
                         │
┌────────────────────────▼────────────────────────┐
│              APPLICATION LAYER                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │  Auth    │ │ Students │ │   Attendance     │ │
│  │ Module   │ │ Module   │ │   Module         │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │ Results  │ │Payments  │ │  Communication   │ │
│  │ Module   │ │ Module   │ │  Module          │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
└────────────────────────┬────────────────────────┘
                         │
┌────────────────────────▼────────────────────────┐
│                  DATA LAYER                      │
│  PostgreSQL (primary) │ Redis (cache/sessions)  │
│  S3-compatible storage (files/documents)        │
└─────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### 3.1 Frontend
| Component | Technology | Reason |
|-----------|-----------|--------|
| Framework | Next.js (React) | SSR for performance on slow connections |
| Styling | Tailwind CSS | Fast, consistent UI |
| State Management | Zustand + React Query | Lightweight, cache-aware |
| PWA | next-pwa | Offline support, installable |
| Charts/Analytics | Recharts | Lightweight dashboards |
| Forms | React Hook Form + Zod | Fast validation |

### 3.2 Backend
| Component | Technology | Reason |
|-----------|-----------|--------|
| Runtime | Node.js (TypeScript) | Unified JS ecosystem, strong typing |
| Framework | NestJS | Modular, scalable, DI pattern |
| API | REST + WebSockets | REST for CRUD, WS for real-time notifications |
| Auth | JWT + Refresh Tokens | Stateless, scalable |
| ORM | Prisma | Type-safe, great DX |
| Task Queue | BullMQ (Redis) | Background jobs (SMS, reports, sync) |
| File Handling | AWS S3 / Cloudflare R2 | Scalable file storage |

### 3.3 Database
| Component | Technology | Reason |
|-----------|-----------|--------|
| Primary DB | PostgreSQL | Relational, reliable, multi-tenant ready |
| Cache | Redis | Sessions, rate limiting, job queues |
| Search | PostgreSQL Full-Text Search (Phase 1), Meilisearch (Phase 2) | |

### 3.4 Infrastructure
| Component | Technology |
|-----------|-----------|
| Cloud | AWS (af-south-1 Cape Town region) or GCP (africa-south1) |
| Containerization | Docker + Docker Compose |
| Orchestration | AWS ECS or Kubernetes (at scale) |
| CDN | Cloudflare |
| CI/CD | GitHub Actions |
| Monitoring | Sentry (errors) + Grafana + Prometheus (metrics) |
| Logging | Winston + CloudWatch |

### 3.5 Third-Party Integrations
| Service | Provider |
|---------|---------|
| Payments | Paystack (NG/GH), Flutterwave (multi-country), M-Pesa (KE) |
| SMS | Africa's Talking (primary), Termii (NG fallback) |
| Email | SendGrid |
| Push Notifications | Firebase Cloud Messaging (FCM) |

---

## 4. Multi-Tenancy Design

**Strategy: Schema-per-tenant (PostgreSQL schemas)**

Each school gets its own database schema under a shared PostgreSQL instance. This provides:
- Strong data isolation between schools
- Easier per-tenant backups and migrations
- Simpler compliance (data residency)

```
PostgreSQL Instance
├── schema: tenant_schoolcode_001  (School A)
├── schema: tenant_schoolcode_002  (School B)
└── schema: public                 (Shared: plans, system config)
```

Tenant resolution via subdomain: `schoolname.educore.app`

---

## 5. Authentication & Authorization

### Auth Flow
1. User submits credentials (email/phone + password)
2. Server validates and issues: `access_token` (15 min TTL) + `refresh_token` (30 days TTL)
3. Access token stored in memory; refresh token in httpOnly cookie
4. Refresh endpoint silently renews access token

### Role-Based Access Control (RBAC)
```
Super Admin     → Full system access
School Admin    → Full school-level access
Teacher         → Own classes + students in those classes
Parent          → Own children's data only
Student         → Own academic data only
```

---

## 6. Offline Architecture

Critical for African network conditions.

### Strategy: Service Worker + IndexedDB

```
Online:  App fetches data from API → stores in IndexedDB cache
Offline: App reads from IndexedDB → queues mutations locally
Reconnect: Background sync flushes queue to server → resolves conflicts
```

### Offline-capable features (MVP):
- Attendance marking
- Viewing previously loaded student lists
- Viewing downloaded results/report cards

### Conflict resolution:
- Last-write-wins for attendance (server timestamp authoritative)
- Soft-lock for grade entry (teacher must re-confirm on conflict)

---

## 7. Database Schema (Core Tables)

```sql
-- Schools (tenant registry)
schools: id, name, code, country, currency, subscription_tier, created_at

-- Users (cross-tenant auth)
users: id, school_id, role, email, phone, password_hash, created_at

-- Students
students: id, school_id, admission_number, first_name, last_name, 
          class_id, dob, gender, guardian_id, photo_url, created_at

-- Classes
classes: id, school_id, name, section, academic_year, teacher_id

-- Attendance
attendance: id, student_id, class_id, date, status (present/absent/late), 
            marked_by, created_at

-- Subjects
subjects: id, school_id, name, class_id, teacher_id

-- Grades
grades: id, student_id, subject_id, term, ca_score, exam_score, 
        total, grade, created_at

-- Fees
fee_structures: id, school_id, class_id, name, amount, term, academic_year
fee_payments: id, student_id, fee_structure_id, amount_paid, 
              payment_date, method, reference, status

-- Announcements
announcements: id, school_id, title, body, target_role, 
               created_by, created_at
```

---

## 8. API Design

**Base URL:** `https://api.educore.app/v1`

**Convention:** RESTful with consistent response envelope:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "meta": { "page": 1, "total": 50 }
}
```

### Key Endpoints (Sample)
```
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout

GET    /schools/:schoolId/students
POST   /schools/:schoolId/students
GET    /schools/:schoolId/students/:studentId

POST   /classes/:classId/attendance
GET    /classes/:classId/attendance?date=2026-03-01

POST   /students/:studentId/grades
GET    /students/:studentId/report-card?term=1&year=2026

GET    /schools/:schoolId/fees/summary
POST   /payments/initialize
POST   /payments/webhook  (Paystack/Flutterwave webhook)

POST   /announcements
GET    /announcements?role=parent
```

---

## 9. Notification System

```
Event Trigger → BullMQ Queue → Notification Worker
                                    ├── In-app (WebSocket)
                                    ├── Push (FCM)
                                    ├── Email (SendGrid)
                                    └── SMS (Africa's Talking)
```

Notification types:
- Student marked absent → Parent SMS + Push
- New report card published → Parent Push + Email
- Fee payment due → Parent SMS
- New announcement → All relevant roles

---

## 10. File Storage

```
/uploads/
  schools/{school_id}/
    logo/
    students/{student_id}/photo
    resources/{class_id}/{subject_id}/{filename}
    report-cards/{student_id}/{term}/{year}.pdf
```

- Files served via Cloudflare CDN with signed URLs
- Max upload size: 20MB per file
- Accepted types: PDF, DOCX, XLSX, PNG, JPG

---

## 11. Security Considerations

- All data encrypted at rest (AES-256) and in transit (TLS 1.3)
- SQL injection prevention via Prisma ORM parameterized queries
- XSS protection via Content Security Policy headers
- Rate limiting on auth endpoints (5 attempts / 15 min)
- RBAC enforced at API middleware layer — not just frontend
- Webhook signature verification for payment providers
- PII fields (phone, email) encrypted in DB
- Regular automated backups (daily snapshots, 30-day retention)

---

## 12. Scalability Plan

| Stage | Users | Architecture |
|-------|-------|-------------|
| MVP | < 50 schools | Single server + managed DB |
| Growth | 50–500 schools | Auto-scaling ECS + RDS read replicas |
| Scale | 500+ schools | Microservices extraction, global CDN, regional DB |

---

## 13. Development Environment

```bash
# Prerequisites
Node.js 20+, Docker, PostgreSQL 15

# Setup
git clone https://github.com/educore/educore
cd educore
cp .env.example .env
docker-compose up -d   # starts DB + Redis
npm install
npx prisma migrate dev
npm run dev
```

---

*Document Owner: Engineering Team | Last Updated: March 2026*
