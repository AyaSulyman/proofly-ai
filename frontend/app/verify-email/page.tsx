"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { App } from "antd";
import { AuthShell } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";

function VerifyEmailContent() {
  const params = useSearchParams(); const { message } = App.useApp();
  const email = params.get("email") || ""; const uid = params.get("uid"); const token = params.get("token");
  const [status, setStatus] = useState(uid && token ? "Verifying your email…" : "Check your inbox");
  useEffect(() => {
    if (!uid || !token) return;
    fetch("/api/auth/verify-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ uid, token }) })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(String(Object.values(data).flat()[0])); setStatus("Email verified successfully"); message.success("Email verified successfully."); })
      .catch((error) => { setStatus("Verification link invalid or expired"); message.error(error.message); });
  }, [uid, token, message]);
  async function resend() {
    if (!email) { message.error("Open this page from registration or enter via your email link."); return; }
    const response = await fetch("/api/auth/resend-verification", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    const data = await response.json();
    if (response.ok) message.success(data.detail);
    else message.error(data.detail || "Could not resend email.");
  }
  return <div className="w-full max-w-[440px] rounded-[22px] bg-white/97 p-9 text-center shadow-card">
    <div className="mx-auto mb-4 flex h-15 w-15 items-center justify-center rounded-full bg-info-bg text-2xl text-info">✉️</div>
    <h2 className="mb-2 text-xl font-bold text-navy-700">{status}</h2>
    <p className="mb-5 text-[13.5px] leading-relaxed text-navy-300">Use the secure link sent to your email to activate your Proofly account.</p>
    {email && <div className="mb-5 inline-block rounded-lg bg-navy-50 px-3.5 py-2.5 text-[13px] font-bold">{email}</div>}
    {!uid && <Button type="button" onClick={resend} block variant="navy" className="mb-3">Resend Email</Button>}
    <Button block variant="outline" href="/login">Continue to Sign In</Button>
  </div>;
}

export default function VerifyEmailPage() { return <AuthShell><Suspense><VerifyEmailContent /></Suspense></AuthShell>; }
