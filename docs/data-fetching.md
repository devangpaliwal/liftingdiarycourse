# Data Fetching

## CRITICAL: Server Components Only

**All data fetching in this application MUST be done exclusively via React Server Components.**

- **DO NOT** fetch data in route handlers (e.g., `app/api/*/route.ts`)
- **DO NOT** fetch data in Client Components (files with `"use client"`)
- **DO** fetch data directly in Server Components by calling helper functions from the `/data` directory

This is a hard rule. If you find yourself reaching for `useEffect` + `fetch`, or writing a route handler to supply data to a page, stop and restructure as a Server Component instead.

## Database Access: `/data` Directory Only

All database queries **must** go through helper functions located in the `/data` directory.

**Rules:**

- Every database operation must live in a dedicated helper function inside `/data`
- Helper functions **must** use [Drizzle ORM](https://orm.drizzle.team/) — **never write raw SQL**
- No query logic should be inlined into components or route handlers

**Example structure:**

```
src/
  data/
    workouts.ts      # getWorkoutsByUserId(), createWorkout(), etc.
    exercises.ts     # getExercises(), getExerciseById(), etc.
```

## CRITICAL: Authorization — Authenticate Inside Every Helper Function

**Every `/data` helper function that touches user-specific data must authenticate the user itself.** Do not rely on the caller to pass in a `userId` — that is not safe, as callers could supply an arbitrary ID.

**The helper function must:**

1. Call `auth()` internally to get the current session
2. Throw (or redirect) immediately if there is no session
3. Use `session.user.id` — never a value from function arguments or URL params — as the filter in the query

This means authorization is enforced at the data layer, not just at the component layer. Even if a component forgets to check auth, the data function will still refuse to return data for an unauthenticated request.

**Wrong — DO NOT do this (trusts the caller to supply the right userId):**

```ts
// ❌ Caller could pass any userId — this is a security hole
export async function getWorkoutsByUserId(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

**Correct — auth lives inside the helper:**

```ts
// ✅ src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function getWorkouts() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, session.user.id));
}
```

**Server Component — just call the helper, no userId threading needed:**

```tsx
// ✅ src/app/dashboard/page.tsx
import { getWorkouts } from "@/data/workouts";

export default async function DashboardPage() {
  const workouts = await getWorkouts(); // auth is enforced inside
  // ...
}
```

## CRITICAL: Data Isolation — Users Must Only Access Their Own Data

**Every query that touches user-specific data must be filtered by the authenticated user's ID from the session.**

- Never query without a `userId` filter on user-owned tables
- Never return data for all users
- Never trust a `userId` from URL params, route segments, or request body for authorization — always use `session.user.id`
- Accessing another user's data, even accidentally, is a **critical security bug**

**Wrong:**

```ts
// ❌ Returns all users' data
export async function getWorkouts() {
  return db.select().from(workouts);
}

// ❌ Trusts caller-supplied ID — caller could be malicious
export async function getWorkouts(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

**Correct:**

```ts
// ✅ Always scoped to the currently authenticated user
export async function getWorkouts() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return db.select().from(workouts).where(eq(workouts.userId, session.user.id));
}
```
