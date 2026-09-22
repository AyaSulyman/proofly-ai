"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/session";

export async function postDisputeMessage(disputeId: string, text: string) {
  await apiFetch(`/api/disputes/${disputeId}/messages/`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
  revalidatePath(`/disputes/${disputeId}`);
}

export async function resolveDispute(disputeId: string) {
  await apiFetch(`/api/disputes/${disputeId}/resolve/`, { method: "POST" });
  revalidatePath(`/disputes/${disputeId}`);
}
