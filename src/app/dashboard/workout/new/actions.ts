"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";

const CreateWorkoutSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
});

type CreateWorkoutInput = z.infer<typeof CreateWorkoutSchema>;

export async function createWorkoutAction(input: CreateWorkoutInput) {
  const result = CreateWorkoutSchema.safeParse(input);

  if (!result.success) {
    return { success: false as const, errors: result.error.flatten().fieldErrors };
  }

  const workout = await createWorkout(
    result.data.name,
    new Date(`${result.data.date}T00:00:00`)
  );

  return { success: true as const, data: workout };
}
