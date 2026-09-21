"use server";

import { apiFetch, ApiError } from "@/lib/session";

export async function submitReport(formData: FormData) {
  try {
    await apiFetch("/api/community/reports/", { method: "POST", body: JSON.stringify({ investigation: formData.get("investigationId"), category: formData.get("category"), description: formData.get("description") }) });
    return { success: true as const, error: null };
  } catch (error) {
    const data = error instanceof ApiError ? error.data as Record<string, unknown> : null;
    return { success: false as const, error: String((data ? Object.values(data).flat()[0] : null) || "Could not submit report.") };
  }
}
