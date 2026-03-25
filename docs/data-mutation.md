# Data Mutation Standards

## Overview

All data mutations in this app follow a two-layer pattern: **server actions** (in colocated `actions.ts` files) call **data helper functions** (in `src/data/`) which wrap Drizzle ORM calls.

---

## Layer 1: Data Helper Functions (`src/data/`)

All direct database mutation calls must live in `src/data/` as named helper functions. No component, page, or server action may call Drizzle ORM directly.

### Rules

- One file per domain (e.g., `src/data/workouts.ts`, `src/data/exercises.ts`)
- Functions are plain async functions — no `"use server"` directive here
- Accept typed parameters only — no raw DB types leaking out
- Return typed results

### Example

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createWorkout(data: {
  userId: string;
  date: string;
  notes?: string;
}) {
  const [workout] = await db.insert(workouts).values(data).returning();
  return workout;
}

export async function deleteWorkout(id: string) {
  await db.delete(workouts).where(eq(workouts.id, id));
}

export async function updateWorkout(
  id: string,
  data: { notes?: string; date?: string }
) {
  const [workout] = await db
    .update(workouts)
    .set(data)
    .where(eq(workouts.id, id))
    .returning();
  return workout;
}
```

---

## Layer 2: Server Actions (`actions.ts`)

All mutations triggered from the UI must go through Next.js server actions defined in colocated `actions.ts` files, located next to the page or component that uses them.

### Rules

- File must include `"use server"` at the top
- File must be named `actions.ts` and colocated with the route/component that uses it
  - e.g., `src/app/workouts/new/actions.ts` alongside `src/app/workouts/new/page.tsx`
- All parameters must be explicitly typed — **no `FormData`**
- All input must be validated with [Zod](https://zod.dev) before calling any data helper
- On validation failure, return a typed error — do not throw
- Call data helpers from `src/data/` — never call Drizzle directly

### Example

```ts
// src/app/workouts/new/actions.ts
"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";

const CreateWorkoutSchema = z.object({
  userId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
  notes: z.string().max(1000).optional(),
});

type CreateWorkoutInput = z.infer<typeof CreateWorkoutSchema>;

export async function createWorkoutAction(input: CreateWorkoutInput) {
  const result = CreateWorkoutSchema.safeParse(input);

  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  const workout = await createWorkout(result.data);
  return { success: true, data: workout };
}
```

---

## Summary

| Concern | Location | Drizzle? | Zod? | `"use server"`? |
|---|---|---|---|---|
| DB mutation logic | `src/data/*.ts` | Yes | No | No |
| UI-triggered mutations | `actions.ts` (colocated) | No | Yes | Yes |

---

## Anti-patterns to Avoid

- Calling Drizzle ORM directly from a server action
- Using `FormData` as a server action parameter type
- Defining server actions in page/component files instead of `actions.ts`
- Skipping Zod validation and trusting raw input
- Throwing errors from server actions instead of returning typed error results
