import { Suspense } from "react";
import { getWorkoutsByDate } from "@/data/workouts";
import WorkoutCalendar from "./WorkoutCalendar";
import LogWorkoutButton from "./LogWorkoutButton";

type Props = {
  searchParams: Promise<{ date?: string }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const { date: dateParam } = await searchParams;

  // Normalize to midnight local time when parsed from YYYY-MM-DD
  const normalizedDate = dateParam
    ? new Date(`${dateParam}T00:00:00`)
    : new Date();

  const workouts = await getWorkoutsByDate(normalizedDate);

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workout Dashboard</h1>
        <LogWorkoutButton selectedDate={normalizedDate} />
      </div>
      <Suspense>
        <WorkoutCalendar selectedDate={normalizedDate} workouts={workouts} />
      </Suspense>
    </div>
  );
}
