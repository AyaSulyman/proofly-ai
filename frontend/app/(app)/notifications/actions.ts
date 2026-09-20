"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/session";

export async function markAllRead() {
  await apiFetch("/api/notifications/mark-all-read/", { method: "POST" });
  revalidatePath("/notifications");
}

export async function markRead(id: string) {
  await apiFetch(`/api/notifications/${id}/read/`, { method: "POST" });
  revalidatePath("/notifications");
}
