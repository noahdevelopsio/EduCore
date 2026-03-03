# EduCore Design System
**Version:** 1.0 | **Date:** March 2026 | **Status:** Active

---

## 1. Design Philosophy

EduCore is built for **Africa's schools** — bright, energetic, trustworthy, and accessible.

The visual identity draws from:
- **African earth tones** — warm terracotta, deep forest green, sun gold
- **Clarity over cleverness** — interfaces that a first-time smartphone user can navigate
- **Confidence & authority** — this is a professional tool, not a toy
- **Warmth** — education is human; the product must feel human

### Design Principles
| Principle | What it means |
|-----------|--------------|
| **Clarity First** | Every screen has one primary action. No clutter. |
| **Mobile Native** | Design for 5" Android screens first, desktop second |
| **Low Literacy Friendly** | Icons always accompany text labels |
| **High Contrast** | WCAG AA minimum everywhere; AAA where possible |
| **Consistent Rhythm** | Spacing, sizing, and type follow a strict scale |

---

## 2. Color System

### 2.1 Brand Colors

```css
/* ============================================
   EDUCORE COLOR TOKENS
   ============================================ */

:root {
  /* ── PRIMARY: Forest Green (Trust, Education, Growth) ── */
  --color-primary-50:  #EDFAF2;
  --color-primary-100: #D0F4E0;
  --color-primary-200: #A4E8C3;
  --color-primary-300: #6DD6A0;
  --color-primary-400: #38C47D;
  --color-primary-500: #1AAF64;   /* ← MAIN BRAND COLOR */
  --color-primary-600: #128A4D;
  --color-primary-700: #0E6B3C;
  --color-primary-800: #0A4F2C;
  --color-primary-900: #063320;

  /* ── SECONDARY: Terracotta (Warmth, Africa, Energy) ── */
  --color-secondary-50:  #FEF4EE;
  --color-secondary-100: #FDE5D0;
  --color-secondary-200: #FBC6A0;
  --color-secondary-300: #F7A06A;
  --color-secondary-400: #F27D3A;
  --color-secondary-500: #E85D15;   /* ← ACCENT COLOR */
  --color-secondary-600: #C04710;
  --color-secondary-700: #97360C;
  --color-secondary-800: #6E260A;
  --color-secondary-900: #471706;

  /* ── TERTIARY: Sun Gold (Achievement, Highlights, Awards) ── */
  --color-gold-50:  #FFFBEB;
  --color-gold-100: #FEF3C7;
  --color-gold-200: #FDE68A;
  --color-gold-300: #FCD34D;
  --color-gold-400: #FBBF24;
  --color-gold-500: #F59E0B;   /* ← HIGHLIGHT / BADGE COLOR */
  --color-gold-600: #D97706;
  --color-gold-700: #B45309;
  --color-gold-800: #92400E;
  --color-gold-900: #78350F;

  /* ── NEUTRAL: Warm Gray (not cold blue-gray) ── */
  --color-neutral-0:   #FFFFFF;
  --color-neutral-50:  #FAF9F7;   /* ← Page background */
  --color-neutral-100: #F2EFE9;
  --color-neutral-200: #E5E0D8;
  --color-neutral-300: #CCC5B9;
  --color-neutral-400: #A89E90;
  --color-neutral-500: #7D7166;
  --color-neutral-600: #5C5248;
  --color-neutral-700: #3D352B;
  --color-neutral-800: #261F17;   /* ← Body text */
  --color-neutral-900: #141009;

  /* ── SEMANTIC COLORS ── */
  --color-success:      #1AAF64;   /* same as primary-500 */
  --color-success-bg:   #EDFAF2;
  --color-warning:      #F59E0B;
  --color-warning-bg:   #FFFBEB;
  --color-error:        #DC2626;
  --color-error-bg:     #FEF2F2;
  --color-info:         #2563EB;
  --color-info-bg:      #EFF6FF;

  /* ── SURFACE COLORS ── */
  --color-surface-page:   var(--color-neutral-50);
  --color-surface-card:   #FFFFFF;
  --color-surface-modal:  #FFFFFF;
  --color-surface-hover:  var(--color-neutral-100);
  --color-surface-active: var(--color-primary-50);

  /* ── BORDER COLORS ── */
  --color-border-default: var(--color-neutral-200);
  --color-border-strong:  var(--color-neutral-300);
  --color-border-focus:   var(--color-primary-500);

  /* ── TEXT COLORS ── */
  --color-text-primary:   var(--color-neutral-800);
  --color-text-secondary: var(--color-neutral-500);
  --color-text-disabled:  var(--color-neutral-400);
  --color-text-inverse:   #FFFFFF;
  --color-text-link:      var(--color-primary-600);
  --color-text-danger:    var(--color-error);
}
```

### 2.2 Role-Based Accent Colors
Each user role has a distinct color identity for dashboard headers and navigation:

```css
:root {
  --role-admin:   #1AAF64;   /* Forest Green — authority */
  --role-teacher: #2563EB;   /* Deep Blue — knowledge */
  --role-parent:  #E85D15;   /* Terracotta — warmth */
  --role-student: #7C3AED;   /* Violet — energy/youth */
}
```

### 2.3 Color Usage Rules
- **Primary green** → CTAs, active nav items, success states, links
- **Terracotta** → Secondary CTAs, alerts, notifications, badges
- **Gold** → Achievement badges, premium features, ranking indicators
- **Warm neutral-50** → Page backgrounds (never pure white #fff for backgrounds)
- **Never use** cold blue-grays (#64748B slate family) — they feel foreign to the brand

---

## 3. Typography

### 3.1 Font Stack

```css
/* ── DISPLAY FONT: Sora ──
   Geometric, modern, warm — not robotic.
   Used for headings, hero text, module names.
   Google Fonts: https://fonts.google.com/specimen/Sora
*/
--font-display: 'Sora', 'Trebuchet MS', sans-serif;

/* ── BODY FONT: Plus Jakarta Sans ──
   Humanist, highly legible at small sizes.
   Excellent for African multilingual contexts.
   Google Fonts: https://fonts.google.com/specimen/Plus+Jakarta+Sans
*/
--font-body: 'Plus Jakarta Sans', 'Segoe UI', sans-serif;

/* ── MONO FONT: JetBrains Mono ──
   For code, IDs, admission numbers, transaction refs.
   Google Fonts: https://fonts.google.com/specimen/JetBrains+Mono
*/
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

**Google Fonts import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

**Tailwind config:**
```js
fontFamily: {
  display: ['Sora', 'Trebuchet MS', 'sans-serif'],
  body: ['Plus Jakarta Sans', 'Segoe UI', 'sans-serif'],
  mono: ['JetBrains Mono', 'Courier New', 'monospace'],
}
```

### 3.2 Type Scale

```css
/* Type scale — 1.25 Major Third ratio */
--text-xs:   0.75rem;    /* 12px — labels, captions */
--text-sm:   0.875rem;   /* 14px — secondary text, table cells */
--text-base: 1rem;       /* 16px — body default */
--text-lg:   1.125rem;   /* 18px — lead text, card titles */
--text-xl:   1.25rem;    /* 20px — section headings */
--text-2xl:  1.5rem;     /* 24px — page titles */
--text-3xl:  1.875rem;   /* 30px — dashboard hero numbers */
--text-4xl:  2.25rem;    /* 36px — landing page headings */
--text-5xl:  3rem;       /* 48px — marketing hero */
```

### 3.3 Typography Usage

| Element | Font | Weight | Size | Color |
|---------|------|--------|------|-------|
| Page Title (H1) | Sora | 700 | 2xl–3xl | neutral-800 |
| Section Title (H2) | Sora | 600 | xl–2xl | neutral-800 |
| Card Title (H3) | Sora | 600 | lg | neutral-800 |
| Body Text | Plus Jakarta Sans | 400 | base | neutral-700 |
| Secondary Text | Plus Jakarta Sans | 400 | sm | neutral-500 |
| Label / Caption | Plus Jakarta Sans | 500 | xs | neutral-500 |
| Button Text | Plus Jakarta Sans | 600 | sm–base | varies |
| Stat Number | Sora | 700 | 3xl–4xl | primary-600 |
| Table Cell | Plus Jakarta Sans | 400 | sm | neutral-700 |
| Student ID / Ref | JetBrains Mono | 400 | sm | neutral-600 |
| Error Message | Plus Jakarta Sans | 500 | sm | error |

### 3.4 Line Heights & Letter Spacing

```css
--leading-tight:   1.2;
--leading-snug:    1.35;
--leading-normal:  1.5;
--leading-relaxed: 1.65;   /* use for body text */
--leading-loose:   1.8;    /* use for low-literacy contexts */

--tracking-tight:  -0.02em;   /* headings */
--tracking-normal:  0;
--tracking-wide:    0.04em;   /* labels, caps */
--tracking-widest:  0.1em;    /* badge text */
```

---

## 4. Spacing System

```css
/* Base unit: 4px */
--space-0:  0;
--space-1:  0.25rem;   /* 4px */
--space-2:  0.5rem;    /* 8px */
--space-3:  0.75rem;   /* 12px */
--space-4:  1rem;      /* 16px */
--space-5:  1.25rem;   /* 20px */
--space-6:  1.5rem;    /* 24px */
--space-8:  2rem;      /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */
```

**Layout conventions:**
- Page horizontal padding: `space-4` (mobile), `space-8` (tablet), `space-12` (desktop)
- Card padding: `space-4` (mobile), `space-6` (desktop)
- Section gap: `space-8` (mobile), `space-12` (desktop)
- Form field gap: `space-4`
- Button padding: `space-3 space-5` (vertical horizontal)

---

## 5. Border Radius

```css
--radius-sm:   0.25rem;    /* 4px  — tags, badges */
--radius-md:   0.5rem;     /* 8px  — inputs, small cards */
--radius-lg:   0.75rem;    /* 12px — cards, modals */
--radius-xl:   1rem;       /* 16px — large cards */
--radius-2xl:  1.5rem;     /* 24px — feature cards, hero cards */
--radius-full: 9999px;     /* pills, avatars */
```

---

## 6. Shadows

```css
/* Warm shadows — slight amber tint instead of cold gray */
--shadow-xs:  0 1px 2px rgba(38, 31, 23, 0.06);
--shadow-sm:  0 1px 3px rgba(38, 31, 23, 0.08), 0 1px 2px rgba(38, 31, 23, 0.06);
--shadow-md:  0 4px 6px rgba(38, 31, 23, 0.07), 0 2px 4px rgba(38, 31, 23, 0.06);
--shadow-lg:  0 10px 15px rgba(38, 31, 23, 0.08), 0 4px 6px rgba(38, 31, 23, 0.05);
--shadow-xl:  0 20px 25px rgba(38, 31, 23, 0.1), 0 10px 10px rgba(38, 31, 23, 0.04);
--shadow-card: 0 2px 8px rgba(38, 31, 23, 0.08);
--shadow-card-hover: 0 8px 24px rgba(38, 31, 23, 0.12);
--shadow-focus: 0 0 0 3px rgba(26, 175, 100, 0.25);   /* green focus ring */
```

---

## 7. Component Design Specs

### 7.1 Buttons

```css
/* ── PRIMARY BUTTON ── */
.btn-primary {
  background: var(--color-primary-500);
  color: white;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--text-sm);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: background 150ms ease, transform 100ms ease, box-shadow 150ms ease;
}
.btn-primary:hover  { background: var(--color-primary-600); box-shadow: var(--shadow-md); }
.btn-primary:active { transform: translateY(1px); }
.btn-primary:focus-visible { box-shadow: var(--shadow-focus); outline: none; }
.btn-primary:disabled { background: var(--color-neutral-300); cursor: not-allowed; }

/* ── SECONDARY BUTTON ── */
.btn-secondary {
  background: transparent;
  color: var(--color-primary-600);
  border: 1.5px solid var(--color-primary-500);
  /* same padding, radius, font as primary */
}
.btn-secondary:hover { background: var(--color-primary-50); }

/* ── DANGER BUTTON ── */
.btn-danger {
  background: var(--color-error);
  color: white;
}

/* ── GHOST BUTTON ── */
.btn-ghost {
  background: transparent;
  color: var(--color-neutral-600);
  border: 1.5px solid var(--color-neutral-300);
}

/* ── SIZES ── */
.btn-sm  { font-size: var(--text-xs); padding: var(--space-2) var(--space-3); }
.btn-lg  { font-size: var(--text-base); padding: var(--space-4) var(--space-8); }
```

### 7.2 Form Inputs

```css
.input {
  width: 100%;
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-text-primary);
  background: white;
  border: 1.5px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  transition: border-color 150ms ease, box-shadow 150ms ease;
  appearance: none;
  -webkit-appearance: none;
}
.input::placeholder { color: var(--color-text-disabled); }
.input:hover  { border-color: var(--color-border-strong); }
.input:focus  { border-color: var(--color-border-focus); box-shadow: var(--shadow-focus); outline: none; }
.input.error  { border-color: var(--color-error); }
.input:disabled { background: var(--color-neutral-100); color: var(--color-text-disabled); }

/* Input Label */
.label {
  display: block;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-neutral-700);
  margin-bottom: var(--space-2);
}

/* Helper / Error Text */
.helper-text { font-size: var(--text-xs); color: var(--color-text-secondary); margin-top: var(--space-1); }
.error-text  { font-size: var(--text-xs); color: var(--color-error); margin-top: var(--space-1); }
```

### 7.3 Cards

```css
.card {
  background: var(--color-surface-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-default);
  box-shadow: var(--shadow-card);
  padding: var(--space-6);
  transition: box-shadow 200ms ease;
}
.card:hover { box-shadow: var(--shadow-card-hover); }

/* Stat Card (Dashboard KPIs) */
.stat-card {
  background: white;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border-default);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.stat-card .stat-value {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-primary-600);
  line-height: 1;
}
.stat-card .stat-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  font-weight: 500;
}
```

### 7.4 Badges & Status Pills

```css
/* Base */
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
}

.badge-success  { background: var(--color-success-bg); color: var(--color-primary-700); }
.badge-warning  { background: var(--color-warning-bg); color: #92400E; }
.badge-error    { background: var(--color-error-bg);   color: #991B1B; }
.badge-info     { background: var(--color-info-bg);    color: #1D4ED8; }
.badge-neutral  { background: var(--color-neutral-100); color: var(--color-neutral-600); }

/* Attendance specific */
.badge-present { background: #EDFAF2; color: #0E6B3C; }
.badge-absent  { background: #FEF2F2; color: #991B1B; }
.badge-late    { background: #FFFBEB; color: #92400E; }
```

### 7.5 Navigation (Sidebar)

```css
.sidebar {
  width: 260px;
  background: var(--color-neutral-900);   /* dark sidebar */
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: var(--space-6) 0;
}
.sidebar-logo {
  padding: 0 var(--space-6) var(--space-6);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-6);
  color: rgba(255,255,255,0.6);
  font-size: var(--text-sm);
  font-weight: 500;
  border-radius: 0;
  transition: color 150ms, background 150ms;
  text-decoration: none;
}
.sidebar-nav-item:hover   { color: white; background: rgba(255,255,255,0.06); }
.sidebar-nav-item.active  {
  color: white;
  background: rgba(26, 175, 100, 0.15);
  border-right: 3px solid var(--color-primary-500);
}

/* Mobile: bottom tab bar */
.bottom-tab-bar {
  display: none;
  position: fixed;
  bottom: 0; left: 0; right: 0;
  background: white;
  border-top: 1px solid var(--color-border-default);
  padding: var(--space-2) 0;
  padding-bottom: env(safe-area-inset-bottom, 8px);
  z-index: 100;
}
@media (max-width: 768px) {
  .sidebar { display: none; }
  .bottom-tab-bar { display: flex; justify-content: space-around; }
}
```

### 7.6 Tables

```css
.table-container {
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-default);
  overflow: hidden;
}
.table { width: 100%; border-collapse: collapse; }
.table thead th {
  background: var(--color-neutral-50);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-neutral-500);
  text-transform: uppercase;
  letter-spacing: var(--tracking-widest);
  padding: var(--space-3) var(--space-4);
  text-align: left;
  border-bottom: 1px solid var(--color-border-default);
}
.table tbody tr {
  border-bottom: 1px solid var(--color-neutral-100);
  transition: background 150ms;
}
.table tbody tr:hover { background: var(--color-surface-hover); }
.table tbody td {
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  padding: var(--space-3) var(--space-4);
}
```

---

## 8. Iconography

**Icon Library:** [Lucide Icons](https://lucide.dev) — clean, consistent 24px stroke icons

```js
// Install: npm install lucide-react
import { Users, BookOpen, ClipboardCheck, CreditCard, Bell, BarChart3, Settings } from 'lucide-react'
```

**Icon sizes:**
- Inline text icon: 16px
- Button icon: 18px
- Nav icon: 20px
- Feature icon: 24px
- Hero/marketing icon: 32–48px

**Icon color rule:** Always match icon color to its accompanying text color.

---

## 9. Layout & Grid

### 9.1 Breakpoints
```css
--breakpoint-sm:  640px;   /* large phone landscape */
--breakpoint-md:  768px;   /* tablet */
--breakpoint-lg:  1024px;  /* laptop */
--breakpoint-xl:  1280px;  /* desktop */
--breakpoint-2xl: 1536px;  /* large desktop */
```

### 9.2 Dashboard Layout
```
┌────────────┬──────────────────────────────────┐
│            │  Top Bar (breadcrumb + user)      │
│  Sidebar   ├──────────────────────────────────┤
│  (260px)   │                                   │
│            │  Main Content Area                │
│            │  (max-width: 1200px, centered)    │
│            │                                   │
└────────────┴──────────────────────────────────┘
```

### 9.3 Content Grid
```css
.content-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-6);
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
}

/* Stat cards: 3-up on desktop, 2-up on tablet, 1-up on mobile */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
}
```

---

## 10. Motion & Animation

```css
/* Timing functions */
--ease-default:  cubic-bezier(0.4, 0, 0.2, 1);
--ease-in:       cubic-bezier(0.4, 0, 1, 1);
--ease-out:      cubic-bezier(0, 0, 0.2, 1);
--ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);  /* slight bounce */

/* Durations */
--duration-fast:   100ms;   /* micro-interactions */
--duration-normal: 200ms;   /* most transitions */
--duration-slow:   350ms;   /* page transitions, modals */

/* Standard transitions */
--transition-default: all var(--duration-normal) var(--ease-default);
--transition-colors:  color var(--duration-fast) var(--ease-default),
                      background var(--duration-fast) var(--ease-default),
                      border-color var(--duration-fast) var(--ease-default);
```

**Rules:**
- Never animate more than 3 properties at once
- Respect `prefers-reduced-motion` — disable animations if set
- Page skeleton loaders use shimmer animation, never spinners for content
- Modals: fade-in + scale from 0.95 to 1 in 200ms
- Toast notifications: slide in from right on desktop, bottom on mobile

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. Dark Mode (Phase 2)

EduCore will ship with light mode only for MVP. Dark mode tokens are reserved:

```css
/* [data-theme="dark"] overrides — Phase 2 */
[data-theme="dark"] {
  --color-surface-page:   #0F1410;
  --color-surface-card:   #1A2118;
  --color-text-primary:   #F0F4F1;
  --color-border-default: rgba(255,255,255,0.1);
}
```

---

## 12. Illustrations & Imagery Style

- **Style:** Flat geometric, warm color palette — characters with diverse African features
- **Illustration library:** [Blush.design](https://blush.design) or [unDraw](https://undraw.co) with color customized to brand palette
- **Photography:** When using real photos, prefer images of African schools, students, teachers — not stock Western imagery
- **Empty states:** Always use a small friendly illustration + helpful message, never just text
- **Avatar fallback:** When no photo — show initials in a colored circle using the role-based color

---

## 13. Loading & Skeleton States

```css
/* Shimmer animation for skeleton loaders */
@keyframes shimmer {
  0%   { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-neutral-100) 25%,
    var(--color-neutral-200) 50%,
    var(--color-neutral-100) 75%
  );
  background-size: 1000px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}

/* Skeleton text line */
.skeleton-text { height: 14px; width: 100%; }
.skeleton-text.short { width: 60%; }
.skeleton-circle { border-radius: var(--radius-full); }
```

---

## 14. Accessibility Checklist

- ✅ All interactive elements have `:focus-visible` styles
- ✅ Color contrast minimum 4.5:1 for normal text, 3:1 for large text
- ✅ All form inputs have associated `<label>` elements
- ✅ Error messages are associated with inputs via `aria-describedby`
- ✅ All icons that convey meaning have `aria-label` or accompanying text
- ✅ Modal dialogs trap focus and restore on close
- ✅ Touch targets are minimum 44×44px
- ✅ Text can be resized to 200% without horizontal scrolling
- ✅ `prefers-reduced-motion` respected
- ✅ Language attribute set on `<html>` element

---

## 15. Tailwind Config (tailwind.config.ts)

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#EDFAF2', 100: '#D0F4E0', 200: '#A4E8C3', 300: '#6DD6A0',
          400: '#38C47D', 500: '#1AAF64', 600: '#128A4D', 700: '#0E6B3C',
          800: '#0A4F2C', 900: '#063320',
        },
        secondary: {
          50:  '#FEF4EE', 100: '#FDE5D0', 200: '#FBC6A0', 300: '#F7A06A',
          400: '#F27D3A', 500: '#E85D15', 600: '#C04710', 700: '#97360C',
          800: '#6E260A', 900: '#471706',
        },
        gold: {
          400: '#FBBF24', 500: '#F59E0B', 600: '#D97706',
        },
        neutral: {
          50:  '#FAF9F7', 100: '#F2EFE9', 200: '#E5E0D8', 300: '#CCC5B9',
          400: '#A89E90', 500: '#7D7166', 600: '#5C5248', 700: '#3D352B',
          800: '#261F17', 900: '#141009',
        },
      },
      fontFamily: {
        display: ['Sora', 'Trebuchet MS', 'sans-serif'],
        body:    ['Plus Jakarta Sans', 'Segoe UI', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      borderRadius: {
        sm: '4px', md: '8px', lg: '12px', xl: '16px', '2xl': '24px',
      },
      boxShadow: {
        card:       '0 2px 8px rgba(38, 31, 23, 0.08)',
        'card-hover': '0 8px 24px rgba(38, 31, 23, 0.12)',
        focus:      '0 0 0 3px rgba(26, 175, 100, 0.25)',
      },
    },
  },
  plugins: [],
}

export default config
```

---

*Design System Owner: Design Team | Last Updated: March 2026*
*For questions or updates, file a design system issue in the repo.*
