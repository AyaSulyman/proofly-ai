"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/session";

export async function updateProfile(formData: FormData) {
  await apiFetch("/api/auth/me/", {
    method: "PATCH",
    body: JSON.stringify({
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      location: formData.get("location"),
    }),
  });
  revalidatePath("/settings");
}

export async function updateNotificationPreference(field: string, value: boolean) {
  await apiFetch("/api/auth/me/notification-preferences/", {
    method: "PATCH",
    body: JSON.stringify({ [field]: value }),
  });
  revalidatePath("/settings");
}

export async function changePassword(formData: FormData) {
  try {
    await apiFetch("/api/auth/me/change-password/", {
      method: "POST",
      body: JSON.stringify({
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
        confirmNewPassword: formData.get("confirmNewPassword"),
      }),
    });
    return { success: true, error: null };
  } catch (err) {
    if (err instanceof ApiError) {
      const data = err.data as Record<string, string[] | string>;
      const first = Object.values(data)[0];
      return { success: false, error: Array.isArray(first) ? first[0] : String(first) };
    }
    return { success: false, error: "Something went wrong." };
  }
}

export async function toggleTwoFactor(enabled: boolean) {
  await apiFetch("/api/auth/me/two-factor/", {
    method: "POST",
    body: JSON.stringify({ enabled }),
  });
  revalidatePath("/settings");
}
