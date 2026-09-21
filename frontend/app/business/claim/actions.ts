"use server";

import { apiFetch, ApiError } from "@/lib/session";

interface BusinessResult {
  id: string;
  name: string;
}

interface BusinessListResponse {
  count: number;
  results: BusinessResult[];
}

export async function claimBusiness(formData: FormData) {
  try {
    // The previous claim may have succeeded before the broken redirect.
    const existing = await apiFetch<BusinessListResponse>(
      "/api/businesses/mine/"
    );

    if (existing.results.length > 0 && existing.results[0].id) {
      return {
        success: true as const,
        id: existing.results[0].id,
        error: null,
      };
    }

    const business = await apiFetch<BusinessResult>(
      "/api/businesses/claim/",
      {
        method: "POST",
        body: JSON.stringify({
          name: String(formData.get("name") || ""),
          email: String(formData.get("email") || ""),
          category: String(formData.get("category") || ""),
          website: String(formData.get("website") || ""),
          phone: String(formData.get("phone") || ""),
          location: String(formData.get("location") || ""),
        }),
      }
    );

    if (!business?.id) {
      throw new Error("The Django API did not return the business ID.");
    }

    return {
      success: true as const,
      id: business.id,
      error: null,
    };
  } catch (error) {
    const data =
      error instanceof ApiError
        ? (error.data as Record<string, unknown>)
        : null;

    const firstError = data
      ? Object.values(data).flat()[0]
      : null;

    return {
      success: false as const,
      id: null,
      error:
        error instanceof Error
          ? error.message
          : String(firstError || "Could not claim this business."),
    };
  }
}