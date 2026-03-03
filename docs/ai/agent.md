# Agent Document: EduCore — Roles, Responsibilities & AI Agent Strategy

**Version:** 1.0  
**Date:** March 2026  
**Status:** Draft

---

## PART A: Human Agent Roles (Team Structure)

This section defines the core team roles needed to build and operate EduCore.

---

### 1. Product Manager
**Responsibilities:**
- Own the product roadmap and prioritization
- Write and maintain PRD, user stories, and acceptance criteria
- Coordinate between engineering, design, and business
- Run user research with African schools
- Define and track KPIs (activation, retention, churn)

**Tools:** Notion, Linear, Figma, Google Analytics

---

### 2. UI/UX Designer
**Responsibilities:**
- Design wireframes and high-fidelity mockups for all modules
- Build and maintain the EduCore design system
- Conduct usability testing with real school admins and teachers
- Ensure mobile-first, low-literacy-friendly interface design
- Localization and RTL layout considerations

**Tools:** Figma, FigJam, Maze (usability testing)

---

### 3. Frontend Engineer
**Responsibilities:**
- Build the Next.js web application (PWA)
- Implement offline capabilities using Service Workers + IndexedDB
- Integrate REST API endpoints with React Query
- Ensure performance on low-bandwidth, low-end devices
- Write unit and integration tests

**Stack:** Next.js, TypeScript, Tailwind CSS, Zustand, React Query

---

### 4. Backend Engineer
**Responsibilities:**
- Build and maintain NestJS API
- Design and implement PostgreSQL schemas (multi-tenant)
- Integrate third-party services (Paystack, Flutterwave, Africa's Talking)
- Build notification pipeline (BullMQ workers)
- Write API documentation (Swagger/OpenAPI)
- Implement security measures (auth, RBAC, rate limiting)

**Stack:** NestJS, TypeScript, Prisma, PostgreSQL, Redis, BullMQ

---

### 5. DevOps / Infrastructure Engineer
**Responsibilities:**
- Set up and manage CI/CD pipelines (GitHub Actions)
- Manage cloud infrastructure (AWS/GCP Africa region)
- Configure Docker containers and orchestration
- Set up monitoring, alerting, and logging
- Manage database backups and disaster recovery
- Enforce security hardening and compliance

**Stack:** Docker, GitHub Actions, AWS ECS, Cloudflare, Sentry, Grafana

---

### 6. QA Engineer
**Responsibilities:**
- Write and execute test plans for all features
- Perform manual testing on low-end Android devices
- Set up automated test suites (unit, integration, E2E)
- Test offline behavior and sync functionality
- Test payment flows in sandbox and live environments
- Report and track bugs to resolution

**Tools:** Jest, Playwright, Postman, BrowserStack

---

### 7. Customer Success / Onboarding Specialist
**Responsibilities:**
- Onboard new schools onto the platform
- Conduct training sessions for admins and teachers
- Provide first-line support via chat, phone, WhatsApp
- Collect feedback and surface product improvement insights
- Create help documentation and video tutorials

**Tools:** Intercom, WhatsApp Business, Loom, Notion (help docs)

---

### 8. Sales & Growth Agent
**Responsibilities:**
- Identify and qualify school leads (cold outreach, partnerships)
- Pitch EduCore to school owners and proprietors
- Manage the sales pipeline (CRM)
- Close subscription deals and handle contract/onboarding handoff
- Attend education conferences and expos across Africa

**Tools:** HubSpot CRM, WhatsApp, LinkedIn, Google Workspace

---

## PART B: AI Agent Strategy (Embedded Intelligence)

This section outlines how AI agents can be embedded into EduCore to automate tasks, enhance insights, and reduce workload for school staff.

---

### AI Agent 1: Report Card Generator Agent
**Trigger:** Admin publishes results for a term  
**Action:** Automatically generates formatted, printable report cards for all students in a class  
**Output:** PDF report cards with scores, grades, ranking, teacher comments, attendance summary  
**Model:** Template-based generation with LLM for personalized teacher comment suggestions

---

### AI Agent 2: Fee Reminder Agent
**Trigger:** Scheduled (3 days before deadline, on deadline day, 3 days after)  
**Action:** Identifies students with outstanding fees → sends personalized SMS/email to parents  
**Output:** Automated payment reminders with amount owed and payment link  
**Logic:** Skip if payment confirmed; escalate if 7 days overdue

---

### AI Agent 3: Attendance Alert Agent
**Trigger:** Teacher marks a student absent  
**Action:** Sends real-time SMS and push notification to parent/guardian  
**Output:** "Dear Mrs. Fatima, your child Emeka was marked absent today, March 1, 2026. Please contact the school if this is unexpected."  
**Extra:** Flags students absent 3+ consecutive days for admin review

---

### AI Agent 4: Academic Insight Agent *(Phase 2)*
**Trigger:** End of term / on-demand  
**Action:** Analyzes student performance trends across subjects and terms  
**Output:** Personalized insight cards per student — "Emeka's Math scores have dropped 15% this term compared to last term."  
**Target Users:** Teachers, school admin, parents

---

### AI Agent 5: Timetable Conflict Detector Agent *(Phase 2)*
**Trigger:** Admin creates or edits a timetable  
**Action:** Scans for conflicts (teacher double-booked, room overlap, subject exceeds hours)  
**Output:** Flags conflicts with suggested resolutions  
**Model:** Constraint satisfaction logic

---

### AI Agent 6: School Health Dashboard Agent *(Phase 2)*
**Trigger:** Daily at 7 AM  
**Action:** Compiles overnight data — attendance, payments, new enrollments, system errors  
**Output:** Daily briefing digest sent to school admin/owner via email or in-app  
**Goal:** Give school owners a "pulse check" without logging in

---

### AI Agent 7: Support Chatbot Agent *(Phase 3)*
**Trigger:** Parent or teacher opens help chat  
**Action:** Answers common questions — how to pay fees, how to view results, how to reset password  
**Escalation:** Hands off to human support agent when confidence is low  
**Languages:** English, French, Pidgin, Swahili

---

## PART C: Agent Interaction Map

```
School Admin
    │
    ├── Onboarding Specialist (human) → School Setup
    ├── Report Card Generator Agent → Auto PDF reports
    ├── Fee Reminder Agent → Auto payment chasing
    └── School Health Agent → Daily digest

Teacher
    ├── Attendance Alert Agent → Parent auto-notified
    ├── Academic Insight Agent → Student performance analysis
    └── Timetable Conflict Detector → Schedule management

Parent
    ├── Attendance Alert Agent → Absence notifications
    ├── Fee Reminder Agent → Payment reminders
    └── Support Chatbot → Self-service help

Student
    └── Academic Insight Agent → Personal performance insights
```

---

## PART D: Agent Governance

| Rule | Detail |
|------|--------|
| Data access | Agents only access data within their school's tenant scope |
| Logging | All agent actions are logged with timestamp and trigger event |
| Override | Humans can always override or cancel an agent action |
| Transparency | Users are always notified when an action was taken by an agent |
| Opt-out | Schools can disable individual agents in settings |

---

*Document Owner: Product & Engineering Teams | Last Updated: March 2026*
