# EduCore — Design System

## Fonts (Load via Google Fonts)
```
Display:  Sora          → headings, stat numbers, module names
Body:     Plus Jakarta Sans → all UI text, buttons, labels
Mono:     JetBrains Mono → IDs, transaction refs, admission numbers
```
```html
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

## Color Palette (Use These Exact Values)

### Brand Colors
```
Primary Green  (trust, CTAs, active states)
  500: #1AAF64  ← main brand
  600: #128A4D  ← hover
  50:  #EDFAF2  ← light bg

Terracotta  (accent, notifications, secondary CTAs)
  500: #E85D15  ← main accent
  600: #C04710  ← hover
  50:  #FEF4EE  ← light bg

Sun Gold  (achievements, badges, premium)
  500: #F59E0B
  600: #D97706
```

### Neutrals (Warm, Not Cold)
```
50:  #FAF9F7  ← page background
100: #F2EFE9  ← subtle bg
200: #E5E0D8  ← borders
300: #CCC5B9  ← strong border
500: #7D7166  ← secondary text
700: #3D352B  ← body text
800: #261F17  ← headings
```

### Semantic
```
Success: #1AAF64 bg: #EDFAF2
Warning: #F59E0B bg: #FFFBEB
Error:   #DC2626 bg: #FEF2F2
Info:    #2563EB bg: #EFF6FF
```

### Role Colors (Dashboard accent per user type)
```
Admin:   #1AAF64  (green)
Teacher: #2563EB  (blue)
Parent:  #E85D15  (terracotta)
Student: #7C3AED  (violet)
```

## Typography Scale
```
xs:   12px  → captions, labels
sm:   14px  → table cells, secondary text
base: 16px  → body default
lg:   18px  → card titles
xl:   20px  → section headings
2xl:  24px  → page titles
3xl:  30px  → stat numbers
4xl:  36px  → dashboard hero
```

## Spacing (4px base unit)
```
1 = 4px   2 = 8px   3 = 12px  4 = 16px
5 = 20px  6 = 24px  8 = 32px  10 = 40px
12 = 48px  16 = 64px
```

## Border Radius
```
sm:   4px  → tags, badges
md:   8px  → inputs, buttons
lg:   12px → cards
xl:   16px → large cards
2xl:  24px → hero sections
full: 9999px → pills, avatars
```

## Shadows (Warm Toned)
```
card:       0 2px 8px rgba(38,31,23,0.08)
card-hover: 0 8px 24px rgba(38,31,23,0.12)
focus:      0 0 0 3px rgba(26,175,100,0.25)
```

## Tailwind Config
```typescript
// tailwind.config.ts
colors: {
  primary: { 50:'#EDFAF2', 500:'#1AAF64', 600:'#128A4D', 700:'#0E6B3C' },
  secondary: { 50:'#FEF4EE', 500:'#E85D15', 600:'#C04710' },
  gold: { 500:'#F59E0B', 600:'#D97706' },
  neutral: {
    50:'#FAF9F7', 100:'#F2EFE9', 200:'#E5E0D8', 300:'#CCC5B9',
    500:'#7D7166', 700:'#3D352B', 800:'#261F17', 900:'#141009'
  }
},
fontFamily: {
  display: ['Sora', 'sans-serif'],
  body:    ['Plus Jakarta Sans', 'sans-serif'],
  mono:    ['JetBrains Mono', 'monospace'],
}
```

## Component Specs

### Buttons
```tsx
// Primary
<button className="bg-primary-500 hover:bg-primary-600 text-white font-body font-semibold text-sm px-5 py-3 rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 disabled:bg-neutral-300">

// Secondary (outline)
<button className="border-[1.5px] border-primary-500 text-primary-600 hover:bg-primary-50 font-body font-semibold text-sm px-5 py-3 rounded-md transition-colors">

// Danger
<button className="bg-red-600 hover:bg-red-700 text-white ...same as primary...">
```

### Inputs
```tsx
<input className="w-full font-body text-base text-neutral-800 bg-white border-[1.5px] border-neutral-200 hover:border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/25 rounded-md px-4 py-3 outline-none transition-colors placeholder:text-neutral-400" />
```

### Cards
```tsx
<div className="bg-white border border-neutral-200 rounded-lg shadow-card hover:shadow-card-hover transition-shadow p-6">
```

### Stat Cards (Dashboard KPIs)
```tsx
<div className="bg-white border border-neutral-200 rounded-xl p-6">
  <p className="font-body text-sm font-medium text-neutral-500">Total Students</p>
  <p className="font-display text-3xl font-bold text-primary-600 mt-1">1,248</p>
  <p className="font-body text-xs text-neutral-400 mt-1">+12 this term</p>
</div>
```

### Badges / Status Pills
```tsx
// Present
<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide bg-primary-50 text-primary-700">Present</span>
// Absent
<span className="... bg-red-50 text-red-700">Absent</span>
// Late
<span className="... bg-amber-50 text-amber-700">Late</span>
// Paid
<span className="... bg-primary-50 text-primary-700">Paid</span>
// Unpaid
<span className="... bg-red-50 text-red-700">Unpaid</span>
```

### Sidebar Navigation
```tsx
// Dark sidebar
<nav className="w-64 bg-neutral-900 h-screen flex flex-col py-6">
  // Nav item
  <a className="flex items-center gap-3 px-6 py-3 text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors
     // Active state adds:
     active:text-white active:bg-primary-500/15 active:border-r-[3px] active:border-primary-500">
```

### Tables
```tsx
<div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
  <table className="w-full">
    <thead>
      <tr className="bg-neutral-50 border-b border-neutral-200">
        <th className="font-body text-xs font-semibold text-neutral-500 uppercase tracking-widest px-4 py-3 text-left">
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
        <td className="font-body text-sm text-neutral-800 px-4 py-3">
      </tr>
    </tbody>
  </table>
</div>
```

## Layout Rules
- Page background: always `bg-neutral-50` (never pure white)
- Sidebar width: 260px desktop; hidden on mobile (use bottom tab bar)
- Content max-width: 1200px, centered
- Page padding: `px-4 py-6` mobile → `px-8 py-8` desktop
- Card grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4` for stat cards

## Mobile-First Rules
- Design for 360px width minimum
- Touch targets minimum 44×44px
- Bottom tab bar on mobile (5 items max)
- All tables must be horizontally scrollable on mobile: wrap in `overflow-x-auto`
- Font size never below 14px on mobile

## Never Use
- ❌ Inter, Roboto, Arial, system-ui as primary fonts
- ❌ Purple/violet gradients on white backgrounds
- ❌ Cold blue-grays (#64748B slate family) for neutral text
- ❌ Pure white (#ffffff) as page background
- ❌ `dangerouslySetInnerHTML` without sanitization
