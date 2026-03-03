# Security Document: EduCore
**Version:** 1.0 | **Date:** March 2026 | **Status:** Active  
**Security Owner:** [Engineering Lead / CTO]  
**Review Cycle:** Every 6 months or after any major incident

---

## 1. Security Philosophy

EduCore stores sensitive data about **children, parents, teachers, and financial transactions**. Security is not optional — it is a core product responsibility.

Our approach:
- **Defense in depth** — multiple layers of protection, no single point of failure
- **Least privilege** — users and services only access what they need
- **Secure by default** — features ship secure; developers opt-in to relaxing restrictions, not opt-in to adding them
- **Transparency** — schools are informed about how their data is protected

---

## 2. Data Classification

| Class | Description | Examples | Protection Level |
|-------|-------------|----------|-----------------|
| **Critical** | PII of minors, auth credentials | Student names, DOB, photos, passwords | Encrypted at rest + transit, access logged |
| **Sensitive** | Financial data, parent contacts | Fee payments, phone numbers, emails | Encrypted at rest + transit |
| **Internal** | Operational data | Attendance records, grades, timetables | Encrypted in transit, access controlled |
| **Public** | Non-personal operational info | School name, class names, announcements | Standard protection |

**Rule:** When in doubt, classify up.

---

## 3. Authentication Security

### 3.1 Password Policy
```
Minimum length:         10 characters
Required complexity:    1 uppercase + 1 number + 1 special character
Maximum length:         128 characters (prevent DoS via bcrypt)
Bcrypt salt rounds:     12 (re-evaluate at 14 as hardware improves)
Password history:       Prevent last 5 passwords from being reused
Compromise check:       Validate against HaveIBeenPwned API on registration/change
```

### 3.2 Token Security
```
Access Token:
  - Algorithm:    RS256 (asymmetric — public key verifiable without secret)
  - Expiry:       15 minutes
  - Storage:      JavaScript memory only (never localStorage, never sessionStorage)
  - Payload:      userId, schoolId, role, iat, exp — NO sensitive PII

Refresh Token:
  - Format:       Opaque random token (256-bit, crypto.randomBytes)
  - Expiry:       30 days (rolling — reset on each use)
  - Storage:      httpOnly + Secure + SameSite=Strict cookie ONLY
  - Rotation:     Rotated on every use (refresh token rotation)
  - Invalidation: All tokens for a user invalidated on password change or logout-all
```

### 3.3 Multi-Factor Authentication (Phase 2)
- OTP via SMS for school admins
- TOTP (Google Authenticator) optional for all users
- Required for: super admins, financial actions > threshold amount

### 3.4 Session Management
```
Idle timeout:             30 minutes (configurable by school admin)
Absolute timeout:         8 hours
Concurrent sessions:      Max 3 active sessions per user
Session invalidation:     Immediate on password change, role change, or account suspension
Token blacklist:          Redis-based; tokens added on logout, checked on each request
```

### 3.5 Brute Force Protection
```
Login endpoint:           Max 5 attempts per 15 minutes per IP + per account
                          Exponential backoff after 3 failures: 1s, 5s, 30s, 5min
                          Account lock after 10 failures (30 min lockout)
OTP endpoint:             Max 3 attempts; OTP expires in 5 minutes
Password reset:           Rate limited to 3 requests per hour per email
CAPTCHA:                  Google reCAPTCHA v3 on login after 3 failed attempts
```

---

## 4. Authorization & Access Control

### 4.1 RBAC Matrix

| Resource | Super Admin | School Admin | Teacher | Parent | Student |
|----------|------------|-------------|---------|--------|---------|
| All schools data | ✅ Read/Write | ❌ | ❌ | ❌ | ❌ |
| Own school data | ✅ | ✅ Read/Write | ❌ | ❌ | ❌ |
| All students in school | ✅ | ✅ | Read only | ❌ | ❌ |
| Students in own class | ✅ | ✅ | ✅ Read/Write | ❌ | ❌ |
| Own child's data | ✅ | ✅ | Partial | ✅ Read | ❌ |
| Own academic data | ✅ | ✅ | ✅ | ✅ | ✅ Read |
| Fee management | ✅ | ✅ | ❌ | Pay only | ❌ |
| System config | ✅ | Own school only | ❌ | ❌ | ❌ |
| User management | ✅ | Own school only | ❌ | ❌ | ❌ |
| Announcements | ✅ | ✅ | Own class | Read | Read |

### 4.2 Enforcement Rules
- RBAC enforced at the **service layer** — not just route guards or frontend
- Every database query must include `schoolId` filter (tenant scoping)
- Parent-child relationship verified on every request accessing child data
- Teacher-class assignment verified before accessing class resources
- Admin actions (bulk delete, data export) require re-authentication

### 4.3 Privilege Escalation Prevention
- Role assignments stored in DB; never trust role from JWT alone — re-verify on sensitive operations
- Role changes take effect on next login (token refresh)
- Super admin accounts are not accessible via normal login flow — separate admin console only

---

## 5. Data Encryption

### 5.1 Encryption at Rest
```
Database:         AES-256-GCM via PostgreSQL TDE or disk-level encryption (AWS EBS)
PII fields:       Application-level encryption for: email, phone, parent names, student photos URL
  - Algorithm:    AES-256-GCM
  - Key storage:  AWS KMS or HashiCorp Vault (never in codebase)
  - Key rotation: Every 90 days
File storage:     AWS S3 with SSE-S3 (AES-256) server-side encryption
Backups:          Encrypted before upload; separate encryption key from production
```

### 5.2 Encryption in Transit
```
All connections:  TLS 1.2 minimum; TLS 1.3 preferred
Certificate:      Let's Encrypt (auto-renewed) or AWS ACM
HSTS:             Strict-Transport-Security: max-age=31536000; includeSubDomains
Certificate pinning: Implemented in Phase 3 mobile apps
Internal services: mTLS between microservices (Phase 2)
```

### 5.3 Sensitive Data Handling
- Passwords: **never** logged, stored plain-text, or included in API responses
- Tokens: **never** logged; masked in all monitoring tools
- PAN/card data: **never stored** — all payment processing delegated to Paystack/Flutterwave (PCI DSS compliant)
- SMS OTPs: single-use, 5-minute expiry, deleted after use
- Encryption keys: **never** in source code, `.env` files, or logs

---

## 6. Input Validation & Injection Prevention

### 6.1 Input Validation Rules
```
All inputs:         Validated at API boundary using class-validator (NestJS) or Zod
String fields:      Length limits enforced; HTML stripped via DOMPurify
File uploads:       Type checked (magic bytes, not extension only); max 20MB; scanned by ClamAV
Numbers:            Range validated; integer types enforced; no implicit coercion
UUIDs:              Format validated before DB lookup
Dates:              ISO 8601 format; range sanity check
Phone numbers:      E.164 format validation + region check
```

### 6.2 SQL Injection
- **Prisma ORM** parameterizes all queries by default — no raw SQL unless absolutely required
- If raw SQL is needed: use Prisma's `$queryRaw` with template literals (parameterized) — **never string concatenation**
- Regular automated SQL injection tests in CI pipeline

### 6.3 XSS Prevention
```
Content-Security-Policy:   strict-dynamic; no unsafe-inline; no unsafe-eval
Output encoding:           React escapes by default; dangerouslySetInnerHTML is banned
User-generated content:    Sanitized with DOMPurify before storage and on render
Rich text editor:          If added — allowlist-based sanitization, no script tags
```

### 6.4 CSRF Protection
- SameSite=Strict cookies prevent most CSRF
- Additional: Double Submit Cookie pattern for state-changing requests
- Origin header validation on API endpoints

---

## 7. API Security

### 7.1 Rate Limiting
```
Global (per IP):          200 req/minute
Authenticated (per user): 500 req/minute
Auth endpoints:           See Section 3.5
File upload:              10 uploads/minute per user
Bulk operations:          5 req/minute per user
Payment webhooks:         Whitelisted IPs only (Paystack/Flutterwave ranges)
```

### 7.2 Security Headers (Required on all responses)
```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; ...
```

### 7.3 API Key Management (For external integrations)
- API keys hashed with SHA-256 before DB storage (show plain-text only once at creation)
- Scoped: keys have specific permission scopes, not blanket access
- Rotatable: keys can be rotated without downtime
- Expirable: optional expiry date per key
- Logged: every API key usage is logged with timestamp and endpoint

### 7.4 Webhook Security
```
Paystack:       Validate X-Paystack-Signature using HMAC-SHA512
Flutterwave:    Validate verif-hash header
M-Pesa:         IP whitelist + OAuth token validation
Incoming IPs:   Whitelist payment provider IP ranges at firewall level
Replay attacks: Reject webhooks with timestamps > 5 minutes old
```

---

## 8. Multi-Tenancy Security

### 8.1 Tenant Isolation
- Each school = separate PostgreSQL schema with separate connection pool
- Connection string includes schema name — mismatched schoolId = no data returned
- **Critical rule:** Every service method that queries data **must** accept and apply `schoolId` as a parameter — no exceptions
- Automated test in CI: "tenant bleed test" — verify that User A in School A cannot access any data from School B

### 8.2 Tenant Enumeration Prevention
- School codes and IDs are UUIDs — not sequential integers
- Login error messages are generic: "Invalid credentials" — never "school not found" vs "wrong password"
- API returns 404 (not 403) for resources that belong to another tenant

---

## 9. Infrastructure Security

### 9.1 Network
```
Production:     VPC with private subnets; DB never public-facing
Bastion host:   Required for DB access; SSH key only; no password auth
Firewall:       Security groups allowing only necessary inbound traffic
  - Port 443 (HTTPS): public
  - Port 80 (HTTP): redirects to 443 only
  - Port 22 (SSH): bastion host IP only
  - Port 5432 (PostgreSQL): app server IPs only
  - Port 6379 (Redis): app server IPs only
DDoS protection: Cloudflare (proxy all traffic through Cloudflare)
```

### 9.2 Secrets Management
```
Never in code:       No secrets, keys, passwords, or tokens in source code
Never in .env:       .env files are for local dev only; production uses secrets manager
Production secrets:  AWS Secrets Manager or HashiCorp Vault
CI/CD secrets:       GitHub Actions encrypted secrets (not in logs)
Secret rotation:     Automated rotation for DB passwords every 90 days
Audit:               Any accidental secret commit triggers immediate rotation
```

### 9.3 Container Security
```
Base images:     Use official minimal images (node:20-alpine); scan with Trivy
Run as non-root: All containers run as UID 1001 (non-root user)
Read-only FS:    Container filesystems read-only where possible
No capabilities: Drop all Linux capabilities; add back only what's needed
Image scanning:  Automated scan in CI; block on critical/high CVEs
Dependency scan: npm audit + Snyk in CI pipeline
```

### 9.4 Dependency Management
```
Automated updates:   Dependabot for security patches (auto-merge for patch updates)
Audit in CI:         npm audit --audit-level=high; fail build on high/critical
No abandoned pkgs:   Flag packages with no updates in 2+ years
License check:       Automated license compatibility check in CI
Lock files:          package-lock.json committed; npm ci used in CI (not npm install)
```

---

## 10. Data Privacy & Compliance

### 10.1 Data Minimization
- Collect only data necessary for school management functions
- Optional fields are truly optional — no dark patterns pressuring completion
- Student photos: optional; schools must have parental consent policy
- Review data collection annually and remove unused fields

### 10.2 Data Retention
```
Active account data:   Retained for duration of subscription + 90 days grace
Deleted student data:  Soft delete for 1 year (for record disputes), then hard delete
Payment records:       Retained 7 years (financial regulation compliance)
Audit logs:            Retained 2 years
Failed auth logs:      Retained 90 days
Backup retention:      Daily: 30 days | Weekly: 12 months | Monthly: 3 years
```

### 10.3 Data Subject Rights
- Schools (data controllers) can export all data for a student as JSON/PDF on request
- Student/parent data deletion: admin can trigger full data wipe (except legally required records)
- Data portability: full export of all school data in standard formats (CSV/JSON)

### 10.4 Applicable Regulations
| Country | Regulation | Key Requirements |
|---------|-----------|-----------------|
| Nigeria | NDPR (2019) | Lawful basis for processing; data subject rights; breach notification 72hr |
| Kenya | DPA (2019) | Consent for PII; right to erasure; data localization for sensitive data |
| Ghana | DPA (2012) | Registration with Data Protection Commission; fair processing |
| South Africa | POPIA (2021) | Conditions for lawful processing; security safeguards; breach notification |
| General | GDPR-aligned | Best practice; required for EU school chains |

---

## 11. Security Monitoring & Logging

### 11.1 What to Log
```
Always log:
  - All authentication events (login, logout, failed attempts, password change)
  - All admin actions (create/edit/delete users, bulk operations)
  - All payment events (initiation, success, failure, refund)
  - All data export/download events
  - All permission-denied (403) events
  - All API errors (4xx, 5xx) with request context

Never log:
  - Passwords or tokens (even hashed)
  - Full credit card numbers or PAN
  - Raw SMS OTPs
  - Unmasked PII (log last 4 digits of phone, first letter of name)
```

### 11.2 Log Format
```json
{
  "timestamp": "2026-03-01T10:30:00.000Z",
  "level": "warn",
  "event": "auth.login_failed",
  "userId": null,
  "schoolId": "uuid",
  "ip": "x.x.x.x",
  "userAgent": "...",
  "requestId": "uuid",
  "details": { "reason": "invalid_password", "email": "j***@example.com" }
}
```

### 11.3 Alerting Thresholds
```
🔴 Critical (PagerDuty immediate):
  - 10+ failed login attempts for same account in 5 minutes
  - Any super admin action outside business hours
  - Payment webhook signature failure
  - Database connection from non-whitelisted IP
  - SSL certificate expiry < 14 days

🟡 Warning (Slack alert, next business day):
  - Unusual data export volume (> 500 records in 5 min)
  - New user creation spike (> 50 in 1 hour)
  - API error rate > 5% for 5 minutes
  - Dependency with new critical CVE detected
```

---

## 12. Incident Response

### 12.1 Severity Levels
| Level | Description | Response Time | Examples |
|-------|-------------|--------------|---------|
| P0 — Critical | Data breach, system down | 15 minutes | DB exposed, credentials leaked |
| P1 — High | Security bypass, data corruption | 1 hour | Auth bypass, payment fraud |
| P2 — Medium | Partial service degradation | 4 hours | Rate limiting failure |
| P3 — Low | Minor issue, no data risk | 24 hours | Broken link, UI bug |

### 12.2 Breach Response Protocol
1. **Detect** — alert fires or user reports
2. **Contain** — disable affected feature/endpoint within 15 minutes
3. **Assess** — determine scope: what data, how many affected, how long
4. **Notify** — affected schools notified within 72 hours (NDPR/DPA requirement)
5. **Remediate** — fix root cause, deploy patch
6. **Post-mortem** — written report within 5 business days; shared with affected schools

### 12.3 Emergency Contacts
```
Security Lead:    [Name] — [phone]
Engineering Lead: [Name] — [phone]
Legal Counsel:    [Name] — [phone]
Paystack Support: support@paystack.com (payment issues)
AWS Support:      [support plan URL]
```

---

## 13. Security Testing

### 13.1 Automated (in CI/CD)
- `npm audit` — every build
- Snyk dependency scan — every build; block on high/critical
- Trivy container scan — every Docker build
- OWASP ZAP baseline scan — every staging deployment
- SQL injection test suite — every DB migration

### 13.2 Manual (Scheduled)
| Test Type | Frequency | Responsibility |
|-----------|-----------|---------------|
| Code security review | Every PR for auth/payment code | Senior engineer |
| Penetration test | Every 6 months | External firm |
| RBAC audit | Every quarter | Security lead |
| Social engineering test | Annually | External firm |
| Secrets rotation audit | Every 90 days | DevOps |

### 13.3 Bug Bounty (Phase 2)
- Responsible disclosure policy published at `educore.app/security`
- Scope: web app, API, mobile apps
- Out of scope: DoS attacks, social engineering of staff
- Response SLA: acknowledge in 24h, fix critical in 7 days

---

## 14. Developer Security Checklist

Before every PR that touches auth, payments, or PII — check all of these:

```
Authentication & Authorization
  [ ] All new endpoints have authentication guard applied
  [ ] All new endpoints have role check applied
  [ ] schoolId scoping applied to every DB query
  [ ] Parent-child relationship verified where applicable

Input Handling
  [ ] All inputs validated with DTO/Zod schema
  [ ] File uploads: type checked, size limited, malware scan hooked
  [ ] No user input directly in DB queries (Prisma only)
  [ ] No user input rendered as HTML without sanitization

Secrets & Config
  [ ] No secrets or keys in code or comments
  [ ] No sensitive data in API responses that isn't needed
  [ ] No sensitive data in error messages returned to client

Logging
  [ ] Security events are logged appropriately
  [ ] No PII, passwords, or tokens in logs
  [ ] Errors are caught and handled; no stack traces to client

Payments
  [ ] Webhook signatures verified before processing
  [ ] Idempotency key used to prevent duplicate processing
  [ ] Payment state machine handles all edge cases (pending, failed, refunded)
```

---

*Security Document Owner: Engineering Lead | Review Date: September 2026*  
*To report a security vulnerability: security@educore.app*
