# UI Coding Standards

## Component Library

**All UI components must use shadcn/ui exclusively.**

- Do NOT create custom UI components (buttons, inputs, cards, dialogs, etc.)
- Do NOT use any other component library (MUI, Chakra, Radix primitives directly, etc.)
- Every UI element must come from the shadcn/ui component registry
- If a needed component does not exist in shadcn/ui, add it via the CLI: `npx shadcn@latest add <component>`

## Date Formatting

All dates must be formatted using the `date-fns` package. No other date formatting approach is permitted.

### Required Format

Dates must display with an ordinal day suffix, abbreviated month name, and full year:

```
1st Sep 2025
2nd Jan 2026
5th May 2025
3rd Mar 2026
4th Oct 2025
```

### Implementation

Use `date-fns` `format` with a custom ordinal helper:

```ts
import { format } from "date-fns";

function formatDate(date: Date): string {
  const day = parseInt(format(date, "d"), 10);
  const suffix = getOrdinalSuffix(day);
  return `${day}${suffix} ${format(date, "MMM yyyy")}`;
}

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}
```

### Usage

```tsx
<p>{formatDate(new Date("2025-09-01"))}</p> {/* 1st Sep 2025 */}
<p>{formatDate(new Date("2026-01-02"))}</p> {/* 2nd Jan 2026 */}
<p>{formatDate(new Date("2025-05-05"))}</p> {/* 5th May 2025 */}
```

Place the `formatDate` utility in `src/lib/date.ts` and import from there throughout the project.
