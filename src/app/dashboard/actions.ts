"use server";

import { createWorkout } from "@/data/workouts";
import { revalidatePath } from "next/cache";

export async function logWorkoutAction(name: string, date: Date) {
  await createWorkout(name, date);
  revalidatePath("/dashboard");
}
