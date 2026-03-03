# EduCore — Custom Rules & Feature Specs

## Africa-Specific Rules (Always Apply)

### Performance
- All pages must load in **< 3 seconds on simulated 3G**
- Always lazy-load images with `loading="lazy"` and use `next/image`
- Compress images; max size 500KB for UI images
- Use skeleton loaders, never spinners for content areas
- Minimize JavaScript bundle — code-split by route

### Mobile
- Minimum viewport: **360px width**
- All touch targets: **minimum 44×44px**
- Bottom tab bar on mobile (≤768px) — max 5 items
- All data tables: wrap in `overflow-x-auto`
- No hover-only interactions — must work on touch

### Currency & Localization
```typescript
// Always format currency with the school's currency setting
// Supported: NGN (₦), GHS (₵), KES (KSh), ZAR (R), UGX (USh), XOF (CFA)
function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}
```

### SMS Messages (Africa's Talking)
- Keep under **160 characters** where possible
- Always include school name and student name
- Example absence alert: `[EduCore] Hi Mrs Fatima, Emeka was absent today 01/03. Call school: 080XXXXXXXX`

### Payments
- Always use **Paystack** for Nigeria (NGN) and Ghana (GHS)
- Always use **Flutterwave** for multi-country fallback
- Always use **M-Pesa** for Kenya (KES)
- Never store card data — all payment data stays with the gateway
- Always show payment receipt immediately after success

## Feature Specs by Module

### Attendance
- Teachers mark: PRESENT / ABSENT / LATE per student per day
- Works **offline** — sync when reconnected
- Parent notified automatically via SMS + push when child marked ABSENT
- Flag students absent **3+ consecutive days** for admin review
- Admin can view by: class, date range, individual student

### Results & Report Cards
- Teachers enter: CA score + Exam score per subject per term
- System auto-calculates: total, grade, class position
- Grading scale configurable per school (A-F, 1-9, %, custom)
- Report cards auto-generated as PDF per student per term
- Published report cards visible to parents in their portal
- Include: subject scores, grades, position, teacher comment, attendance summary

### Fee Management
- Admin defines fee structures per class per term
- Parents pay via: Paystack, Flutterwave, M-Pesa
- Auto-generate receipt on successful payment
- Auto-remind parents: 3 days before due, on due date, 3 days after
- Admin dashboard: total collected, outstanding, per-student breakdown

### Dashboard (Admin)
```
Top stats (4 cards):
  - Total Students enrolled
  - Attendance rate today (%)
  - Fees collected this term (currency)
  - Pending fee payments (count)

Charts:
  - Attendance trend (last 30 days, line chart)
  - Fee collection progress (this term, bar chart)

Recent activity feed:
  - Last 10 events (enrollments, payments, etc.)
```

### Notifications
```
Trigger                    → Channel
Student absent             → Parent: SMS + Push
Report card published      → Parent: Push + Email
Fee payment due (3 days)   → Parent: SMS
Fee payment overdue        → Parent: SMS
New announcement           → All target roles: Push + in-app
New student enrolled       → Admin: in-app only
```

## User Access by Screen

### School Admin sees:
- Full dashboard with all stats
- All students, all classes
- All attendance records
- All grades and report cards
- Full fee management
- Send announcements to all

### Teacher sees:
- Dashboard with their class stats only
- Only students in their assigned class(es)
- Mark attendance for their class
- Enter grades for their subjects
- Send announcements to their class only
- View resources for their subjects

### Parent sees:
- Dashboard: child's attendance %, latest grade, fee balance
- Child's attendance history
- Child's report cards (when published)
- Fee balance and payment history
- Pay fees button
- School announcements (read only)

### Student sees:
- Own attendance record
- Own results and report cards (when published)
- Class timetable
- Learning resources for their class
- School announcements (read only)

## Naming Conventions for African Context
```
Use "Term" not "Semester" (more common in African school systems)
Use "Class" not "Grade level" for primary/secondary
Use "Proprietor" or "School Owner" not "Principal" for ownership context
Use "Guardian" not just "Parent" (many students have non-parent guardians)
Support: JSS1-3, SSS1-3 (Nigeria), JHS 1-3 / SHS 1-3 (Ghana), Form 1-4 (Kenya/East Africa)
```
