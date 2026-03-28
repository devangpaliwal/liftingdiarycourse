"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/date";

type Set = {
  id: number;
  setNumber: number;
  reps: number | null;
  weightKg: number | null;
};

type Exercise = {
  id: number;
  name: string;
  sets: Set[];
};

type Workout = {
  id: number;
  name: string;
  exercises: Exercise[];
};

type Props = {
  selectedDate: Date;
  workouts: Workout[];
};

export default function WorkoutCalendar({ selectedDate, workouts }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleDateSelect(date: Date | undefined) {
    if (!date) return;
    const params = new URLSearchParams(searchParams.toString());
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    params.set("date", `${yyyy}-${mm}-${dd}`);
    router.push(`?${params.toString()}`);
    router.refresh();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workouts for {formatDate(selectedDate)}</CardTitle>
        </CardHeader>
        <CardContent>
          {workouts.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No workouts logged for this date.
            </p>
          ) : (
            <ul className="space-y-4">
              {workouts.map((workout) => (
                <li key={workout.id} className="space-y-2">
                  <Link
                    href={`/dashboard/workout/${workout.id}`}
                    className="font-semibold hover:underline"
                  >
                    {workout.name}
                  </Link>
                  {workout.exercises.map((exercise) => (
                    <div key={exercise.id} className="rounded-lg border p-3 space-y-1">
                      <p className="font-medium">{exercise.name}</p>
                      {exercise.sets.length > 0 && (
                        <ul className="space-y-1">
                          {exercise.sets.map((set) => (
                            <li
                              key={set.id}
                              className="text-sm text-muted-foreground flex justify-between"
                            >
                              <span>Set {set.setNumber}</span>
                              <span>
                                {set.reps != null ? `${set.reps} reps` : "—"}
                                {set.weightKg != null ? ` @ ${set.weightKg}kg` : ""}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
