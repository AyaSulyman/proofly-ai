"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { markAllRead } from "./actions";
import { App } from "antd";

export function MarkAllReadButton() {
  const [pending, startTransition] = useTransition();
  const { message } = App.useApp();
  return (
    <Button variant="outline" size="sm" disabled={pending} onClick={() => startTransition(async () => {
      try { await markAllRead(); message.success("All notifications marked as read."); }
      catch { message.error("Could not update notifications."); }
    })}>
      {pending ? "Marking…" : "Mark all as read"}
    </Button>
  );
}
