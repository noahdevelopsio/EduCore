# EduCore — Security Policies

## Non-Negotiable Rules
These apply to every single line of code generated. No exceptions.

## Authentication
```
Passwords:     bcrypt, salt rounds 12. NEVER store plain text.
Access token:  JWT RS256, 15min expiry, stored in JS memory only
Refresh token: Opaque 256-bit random, 30d expiry, httpOnly + Secure + SameSite=Strict cookie
Never store:   Tokens in localStorage or sessionStorage — EVER
```

## Authorization — RBAC
Apply role check at the **service layer**, not just the controller:
```typescript
// CORRECT — check in service
async markAttendance(teacherId: string, classId: string, schoolId: string) {
  const teacher = await this.teacherRepo.findById(teacherId, schoolId);
  const isAssigned = await this.classRepo.isTeacherAssigned(teacherId, classId);
  if (!isAssigned) throw new ForbiddenException('Not assigned to this class');
  // proceed...
}

// WRONG — only a route guard is not enough
@UseGuards(JwtGuard, RolesGuard)
@Roles('teacher')
markAttendance() { /* no service-level check */ }
```

### RBAC Matrix
```
SUPER_ADMIN  → all schools, all data
SCHOOL_ADMIN → own school only, all modules
TEACHER      → own assigned classes + those students only
PARENT       → own children's data + fee payments only
STUDENT      → own academic records only (read)
```

## Tenant Isolation
```typescript
// EVERY query must include schoolId — this is mandatory
// CORRECT
prisma.student.findMany({ where: { schoolId, deletedAt: null } })

// WRONG — tenant bleed vulnerability
prisma.student.findMany({ where: { id: studentId } })
```

## Input Validation
```typescript
// All inputs validated via DTO class-validator or Zod
// String length limits on every string field
// UUIDs validated before DB lookup
// File uploads: check magic bytes, not just extension; max 20MB
// Never use raw string concatenation in queries
```

## Security Headers (Apply to all responses)
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'
```

## Sensitive Data Rules
```
NEVER log:    passwords, tokens, OTPs, full phone numbers, card numbers
NEVER return: password hash in any API response
NEVER store:  card/payment data — delegate entirely to Paystack/Flutterwave
ALWAYS mask:  PII in logs (show j***@email.com not full email)
ALWAYS use:   parameterized queries (Prisma handles this — never raw string SQL)
```

## Payment Webhook Security
```typescript
// Always verify webhook signatures before processing
// Paystack: HMAC-SHA512 with X-Paystack-Signature header
// Flutterwave: verify verif-hash header
// Reject webhooks with timestamps older than 5 minutes (replay attack prevention)
// Use idempotency keys to prevent duplicate payment processing
```

## Rate Limiting (Apply These Limits)
```
Login endpoint:     5 attempts / 15 min per IP + per account
OTP endpoint:       3 attempts / 5 min
Password reset:     3 requests / hour per email
File upload:        10 uploads / min per user
Bulk operations:    5 requests / min per user
Global per IP:      200 requests / min
```

## Secrets
```
NEVER in code:    No API keys, secrets, or passwords in source files
NEVER in .env:    .env is local dev only; production uses secrets manager
Production:       AWS Secrets Manager or environment variables via CI/CD
Encryption key:   32-char AES-256 key for PII fields — store in secrets manager
```
