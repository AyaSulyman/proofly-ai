"use server";

import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/session";

export async function submitReport(formData: FormData) {
  await apiFetch("/api/community/reports/", {
    method: "POST",
    body: JSON.stringify({
      investigation: formData.get("investigationId"),
      category: formData.get("category"),
      description: formData.get("description"),
    }),
  });
  redirect("/reports");
}
