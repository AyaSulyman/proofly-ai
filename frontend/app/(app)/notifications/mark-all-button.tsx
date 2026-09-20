"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { markAllRead } from "./actions";

export function MarkAllReadButton() {
  const [pending, startTransition] = useTransition();
  return (
    <Button variant="outline" size="sm" disabled={pending} onClick={() => startTransition(markAllRead)}>
      {pending ? "Marking…" : "Mark all as read"}
    </Button>
  );
}
