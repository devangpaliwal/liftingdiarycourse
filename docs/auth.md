# Auth Coding Standards

## Provider

This app uses **[Clerk](https://clerk.com/)** for authentication. Do not introduce any other auth library (NextAuth, Auth.js, custom JWT, etc.).

## Middleware

Clerk middleware must be registered in `src/middleware.ts` using `clerkMiddleware()` from `@clerk/nextjs/server`. This ensures Clerk's session context is available on every request.

```ts
// src/middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

Do not customise the matcher unless there is a specific, documented reason to do so.

## Getting the Current User

### In Server Components and `/data` helpers

Use `auth()` from `@clerk/nextjs/server`. This is an async function that returns the current session.

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
```

### In Client Components

Use the `useAuth()` or `useUser()` hooks from `@clerk/nextjs`.

```tsx
"use client";
import { useAuth } from "@clerk/nextjs";

const { userId, isLoaded, isSignedIn } = useAuth();
```

## Protecting Data — Auth Inside Every Helper

**Every `/data` helper that touches user-specific data must call `auth()` internally and throw immediately if there is no session.**

Do not accept a `userId` as a parameter — callers could supply an arbitrary ID. Auth must be enforced at the data layer regardless of what the caller provides.

**Wrong:**

```ts
// ❌ Trusts caller-supplied ID — security hole
export async function getWorkouts(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

**Correct:**

```ts
// ✅ src/data/workouts.ts
import { auth } from "@clerk/nextjs/server";

export async function getWorkouts() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

This is also documented in `/docs/data-fetching.md` under the Authorization section.

## Protecting Pages

To redirect unauthenticated users away from a page, use Clerk's `protect()` inside the page's Server Component rather than checking auth in every component manually.

```tsx
// src/app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // ...
}
```

## Sign In / Sign Up UI

Use Clerk's hosted components or embedded components. Do not build custom sign-in/sign-up forms.

- `<SignIn />` — `@clerk/nextjs`
- `<SignUp />` — `@clerk/nextjs`
- `<UserButton />` — profile/avatar button with sign-out built in
- `<SignInButton />` / `<SignOutButton />` — simple trigger buttons

```tsx
import { UserButton } from "@clerk/nextjs";

<UserButton afterSignOutUrl="/" />
```

## User ID in the Database

The `userId` stored in the database is the Clerk user ID (a string such as `user_2abc...`). Never store a separate internal user ID for ownership purposes — always use the Clerk-issued `userId` directly as the foreign key on user-owned tables.

## Environment Variables

Clerk requires the following environment variables. These must be set in `.env.local` and never committed to source control.

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

Optional redirect overrides:

```
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```
