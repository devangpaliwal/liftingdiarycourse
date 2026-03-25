"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { logWorkoutAction } from "./actions";

type Props = {
  selectedDate: Date;
};

export default function LogWorkoutButton({ selectedDate }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!name.trim()) return;

    startTransition(async () => {
      await logWorkoutAction(name.trim(), selectedDate);
      setName("");
      setOpen(false);
    });
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Log Workout</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log New Workout</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Workout name (e.g. Push Day)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!name.trim() || isPending}>
              {isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
