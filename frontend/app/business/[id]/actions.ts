"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/session";

export async function postReview(businessId: string, formData: FormData) {
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") || "");

  await apiFetch(`/api/businesses/${businessId}/reviews/`, {
    method: "POST",
    body: JSON.stringify({ rating, comment }),
  });

  revalidatePath(`/business/${businessId}`);
}
