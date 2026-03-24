"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/date";

// Placeholder workout data for UI purposes
const MOCK_WORKOUTS = [
  { id: 1, name: "Squat", sets: 4, reps: 5, weight: 100 },
  { id: 2, name: "Bench Press", sets: 3, reps: 8, weight: 80 },
  { id: 3, name: "Deadlift", sets: 3, reps: 5, weight: 140 },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">Workout Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && setDate(d)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workouts for {formatDate(date)}</CardTitle>
          </CardHeader>
          <CardContent>
            {MOCK_WORKOUTS.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No workouts logged for this date.
              </p>
            ) : (
              <ul className="space-y-3">
                {MOCK_WORKOUTS.map((workout) => (
                  <li
                    key={workout.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <span className="font-medium">{workout.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {workout.sets} × {workout.reps} @ {workout.weight}kg
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
