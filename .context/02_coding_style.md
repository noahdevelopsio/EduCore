# EduCore — Coding Standards

## General Rules
- Language: **TypeScript everywhere** — strict mode enabled
- No `any` type — use `unknown` and narrow, or define proper interfaces
- Async: always `async/await` — no `.then()` chains
- Imports: use barrel exports (`index.ts`) for clean imports
- Comments: JSDoc for all exported functions and classes
- No magic numbers — use named constants
- Prefer `const` over `let`; never use `var`

## Naming Conventions
```
Variables/functions:  camelCase       → studentId, markAttendance()
Classes/Types/Interfaces: PascalCase  → StudentRecord, AttendanceStatus
Constants:            SCREAMING_SNAKE → MAX_FILE_SIZE_MB
Files (backend):      kebab-case      → attendance.service.ts
Files (frontend):     kebab-case      → attendance-table.tsx
Database tables:      snake_case      → fee_payments, student_records
Environment vars:     SCREAMING_SNAKE → PAYSTACK_SECRET_KEY
```

## Backend (NestJS) Standards

### Module Structure
Every feature follows this exact structure:
```
feature/
├── feature.module.ts
├── feature.controller.ts   ← HTTP layer only, no business logic
├── feature.service.ts      ← All business logic lives here
├── feature.repository.ts   ← All Prisma queries live here
├── dto/
│   ├── create-feature.dto.ts
│   └── update-feature.dto.ts
└── types/
    └── feature.types.ts
```

### API Response Envelope
**Always** return this shape — no exceptions:
```typescript
// Success
{
  success: true,
  data: T,
  message: "Operation successful",
  meta?: { page: number, limit: number, total: number }
}

// Error
{
  success: false,
  data: null,
  message: "Human-readable error message",
  error?: string  // Only in development
}
```

### DTO Validation
Every incoming request must have a DTO with class-validator decorators:
```typescript
export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @IsDateString()
  dateOfBirth: string;

  @IsUUID()
  classId: string;
}
```

### Database Queries (Prisma)
- All queries go in `*.repository.ts` files
- Always include `schoolId` in where clause
- Use `select` to return only needed fields — never return password hash
- Soft deletes: use `deletedAt` timestamp, never hard delete students/staff
```typescript
// CORRECT
async findStudentById(studentId: string, schoolId: string) {
  return this.prisma.student.findFirst({
    where: { id: studentId, schoolId, deletedAt: null },
    select: { id: true, firstName: true, lastName: true, classId: true }
  });
}

// WRONG — missing schoolId scope
async findStudentById(studentId: string) {
  return this.prisma.student.findUnique({ where: { id: studentId } });
}
```

## Frontend (Next.js) Standards

### Component Structure
```typescript
// Always: named export, typed props, no default props without types
interface StudentCardProps {
  student: StudentSummary;
  onSelect?: (id: string) => void;
}

export function StudentCard({ student, onSelect }: StudentCardProps) {
  // hooks first
  const [isExpanded, setIsExpanded] = useState(false);

  // derived state / handlers
  const handleClick = () => onSelect?.(student.id);

  // render
  return (
    <div className="card" onClick={handleClick}>
      ...
    </div>
  );
}
```

### Data Fetching
Always use React Query — never fetch in `useEffect`:
```typescript
// CORRECT
const { data: students, isLoading, error } = useQuery({
  queryKey: ['students', classId],
  queryFn: () => api.get(`/classes/${classId}/students`),
  staleTime: 1000 * 60 * 5, // 5 minutes
});

// WRONG
useEffect(() => {
  fetch('/api/students').then(...)
}, []);
```

### Form Handling
Always use React Hook Form + Zod:
```typescript
const schema = z.object({
  firstName: z.string().min(1, 'Required').max(100),
  classId: z.string().uuid('Invalid class'),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

### Tailwind Class Order
Follow this order: layout → spacing → sizing → typography → colors → borders → effects
```tsx
// CORRECT
<div className="flex items-center gap-4 px-6 py-4 w-full text-sm font-medium text-neutral-800 bg-white border border-neutral-200 rounded-lg shadow-card hover:shadow-card-hover transition-shadow">
```

### Loading & Error States
Every data-fetching component must handle all 3 states:
```tsx
if (isLoading) return <StudentTableSkeleton />;
if (error)     return <ErrorState message="Could not load students" onRetry={refetch} />;
if (!students?.length) return <EmptyState message="No students enrolled yet" />;
return <StudentTable students={students} />;
```

## File Size Limits
- Components: max 200 lines — split if larger
- Services: max 300 lines — split by responsibility
- No God files — one responsibility per file
