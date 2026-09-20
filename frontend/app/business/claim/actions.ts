"use server";

import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/session";

export async function claimBusiness(formData: FormData) {
  const business = await apiFetch<{ id: string }>("/api/businesses/claim/", {
    method: "POST",
    body: JSON.stringify({
      name: formData.get("name"),
      email: formData.get("email"),
      category: formData.get("category") || "",
      website: formData.get("website") || "",
    }),
  });
  redirect(`/business/${business.id}`);
}
