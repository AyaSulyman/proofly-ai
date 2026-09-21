"use server";

import { apiFetch, ApiError } from "@/lib/session";

export async function claimBusiness(formData: FormData) {
  try {
    const business = await apiFetch<{ id: string }>("/api/businesses/claim/", {
      method: "POST",
      body: JSON.stringify({ name: formData.get("name"), email: formData.get("email"), category: formData.get("category") || "", website: formData.get("website") || "", phone: formData.get("phone") || "", location: formData.get("location") || "" }),
    });
    return { success: true as const, id: business.id, error: null };
  } catch (error) {
    const data = error instanceof ApiError ? error.data as Record<string, unknown> : null;
    const first = data ? Object.values(data).flat()[0] : null;
    return { success: false as const, id: null, error: String(first || "Could not claim this business.") };
  }
}
