"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/session";

export async function createInvestigation(formData: FormData) {
  const investigation = await apiFetch<{ id: string }>("/api/investigations/", {
    method: "POST",
    body: JSON.stringify({
      title: formData.get("title"),
      subjectType: formData.get("subjectType"),
      subjectName: formData.get("subjectName") || "",
      subjectPhone: formData.get("subjectPhone") || "",
      subjectEmail: formData.get("subjectEmail") || "",
      subjectUrl: formData.get("subjectUrl") || "",
      notes: formData.get("notes") || "",
    }),
  });
  redirect(`/investigations/${investigation.id}/evidence`);
}

export async function addTextOrUrlEvidence(investigationId: string, type: "text" | "url", value: string) {
  await apiFetch(`/api/investigations/${investigationId}/evidence/`, {
    method: "POST",
    body: JSON.stringify({ type, textValue: value }),
  });
  revalidatePath(`/investigations/${investigationId}/evidence`);
}

export async function addFileEvidence(investigationId: string, type: string, file: File) {
  const body = new FormData();
  body.set("type", type);
  body.set("file", file);
  body.set("fileName", file.name);
  await apiFetch(`/api/investigations/${investigationId}/evidence/`, {
    method: "POST",
    body,
  });
  revalidatePath(`/investigations/${investigationId}/evidence`);
}

export async function removeEvidence(investigationId: string, evidenceId: string) {
  await apiFetch(`/api/investigations/${investigationId}/evidence/${evidenceId}/`, {
    method: "DELETE",
  });
  revalidatePath(`/investigations/${investigationId}/evidence`);
}

export async function addIdentifier(investigationId: string, type: string, value: string) {
  await apiFetch(`/api/investigations/${investigationId}/identifiers/`, { method: "POST", body: JSON.stringify({ type, value }) });
  revalidatePath(`/investigations/${investigationId}/evidence`);
}

export async function removeIdentifier(investigationId: string, identifierId: number) {
  await apiFetch(`/api/investigations/${investigationId}/identifiers/${identifierId}/`, { method: "DELETE" });
  revalidatePath(`/investigations/${investigationId}/evidence`);
}

export async function runAiReview(investigationId: string) {
  const result = await apiFetch<{ evidence: unknown[] }>(`/api/investigations/${investigationId}/ai-review/`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  return result;
}

export async function analyzeInvestigation(investigationId: string) {
  await apiFetch(`/api/investigations/${investigationId}/analyze/`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  redirect(`/investigations/${investigationId}`);
}
