"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { App } from "antd";
import { AuthShell, AuthCard } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, PasswordInput } from "@/components/ui/input";

function ResetForm() {
  const params = useSearchParams(); const router = useRouter(); const { message } = App.useApp(); const [loading, setLoading] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ uid: params.get("uid"), token: params.get("token"), newPassword: form.get("newPassword"), confirmPassword: form.get("confirmPassword") }) });
      const data = await response.json(); if (!response.ok) throw new Error(String(Object.values(data).flat()[0] || "Could not reset password."));
      message.success("Password reset successfully."); router.push("/login");
    } catch (error) { message.error(error instanceof Error ? error.message : "Could not reset password."); } finally { setLoading(false); }
  }
  const validLink = Boolean(params.get("uid") && params.get("token"));
  return <AuthShell topRight={<Button href="/login" variant="outline" size="sm" className="border-white/50 bg-white/15 text-white backdrop-blur">Back to Sign In</Button>}><AuthCard>
    <h1 className="mb-6 mt-3.5 text-center text-[26px] font-extrabold text-navy-700">Set a new <span className="text-gold-500">Password</span></h1>
    {!validLink ? <p className="text-center text-danger">This reset link is missing or invalid. Request a new one.</p> : <form onSubmit={submit}>
      <Field label="New Password"><PasswordInput name="newPassword" placeholder="Enter new password" icon="🔒" required /></Field>
      <Field label="Confirm New Password"><PasswordInput name="confirmPassword" placeholder="Re-enter new password" icon="🔒" required /></Field>
      <Button type="submit" size="md" block disabled={loading}>{loading ? "Resetting…" : "Reset Password →"}</Button>
    </form>}
  </AuthCard></AuthShell>;
}
export default function ResetPasswordPage() { return <Suspense><ResetForm /></Suspense>; }
