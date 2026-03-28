import { notFound } from "next/navigation";
import Link from "next/link";
import { getWorkoutById } from "@/data/workouts";
import { formatDate } from "@/lib/date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function WorkoutDetailPage({ params }: Props) {
  const { id } = await params;
  const workoutId = parseInt(id, 10);

  if (isNaN(workoutId)) {
    notFound();
  }

  const workout = await getWorkoutById(workoutId);

  if (!workout) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-2xl p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">← Back</Link>
        </Button>
        <h1 className="text-2xl font-bold">{workout.name}</h1>
      </div>

      <p className="text-muted-foreground text-sm">
        {formatDate(workout.startedAt)}
      </p>

      {workout.exercises.length === 0 ? (
        <p className="text-muted-foreground text-sm">No exercises logged.</p>
      ) : (
        <div className="space-y-4">
          {workout.exercises.map((exercise) => (
            <Card key={exercise.id}>
              <CardHeader>
                <CardTitle className="text-base">{exercise.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {exercise.sets.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No sets logged.</p>
                ) : (
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
