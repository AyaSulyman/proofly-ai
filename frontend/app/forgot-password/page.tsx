"use client";

import Link from "next/link";
import { useState } from "react";
import { App } from "antd";
import { AuthShell, AuthCard } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email") }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Could not send the reset link.");
      message.success(data.detail);
    } catch (error) { message.error(error instanceof Error ? error.message : "Could not send the reset link."); }
    finally { setLoading(false); }
  }
  return <AuthShell topRight={<Button href="/login" variant="outline" size="sm" className="border-white/50 bg-white/15 text-white backdrop-blur">Back to Sign In</Button>}>
    <AuthCard>
      <h1 className="mb-1.5 mt-3.5 text-center text-[26px] font-extrabold text-navy-700">Forgot your <span className="text-gold-500">Password?</span></h1>
      <p className="mb-6 text-center text-[13.5px] leading-relaxed text-navy-300">Enter the email linked to your account and we&apos;ll send you a reset link.</p>
      <form onSubmit={submit}><Field label="Email Address"><Input name="email" type="email" placeholder="name@company.com" icon="✉️" required /></Field><Button type="submit" size="md" block disabled={loading}>{loading ? "Sending…" : "Send Reset Link →"}</Button></form>
      <p className="mt-4.5 text-center text-[12.5px] text-navy-300">Remembered your password? <Link href="/login" className="font-bold text-info">Sign in</Link></p>
    </AuthCard>
  </AuthShell>;
}
