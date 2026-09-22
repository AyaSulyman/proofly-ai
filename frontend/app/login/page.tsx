"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell, AuthCard, AuthCaption } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/input";
import { App } from "antd";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("sara.ahmed@email.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Invalid email or password.");
      }
      const next = searchParams.get("next") || "/investigations";
      message.success("Signed in successfully.");
      router.push(next);
      router.refresh();
    } catch (err) {
      const text = err instanceof Error ? err.message : "Something went wrong.";
      setError(text);
      message.error(text);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      cursive={"Smarter\nDecisions\nBrighter\nTomorrow."}
      topRight={
        <div className="flex items-center gap-3.5 text-sm text-navy-600">
          <span className="hidden sm:inline">Don&apos;t have an account?</span>
        <Button
  href="/register"
  variant="gold"
  size="sm"
  className="border-gold-300 bg-gold-500 !text-white hover:bg-gold-300 hover:!text-white"
>
  Create Account →
</Button>
        </div>
      }
    >
      <div>
        <AuthCard>
          <h1 className="mb-1.5 mt-3.5 text-center text-[26px] font-extrabold text-navy-700">
            Welcome <span className="text-gold-500">Back</span>
          </h1>
          <p className="mb-6 text-center text-[13.5px] leading-relaxed text-navy-300">
            Sign in to access your dashboard and continue where you left off.
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 rounded-lg bg-danger-bg px-3.5 py-2.5 text-[12.5px] text-danger">{error}</div>
            )}
            <Field label="Email Address">
              <Input
                type="email"
                placeholder="name@company.com"
                icon="✉️"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Field
              label={
                <span className="flex items-center justify-between">
                  Password
                  <Link href="/forgot-password" className="text-[12px] font-semibold text-info">
                    Forgot Password?
                  </Link>
                </span>
              }
            >
              <PasswordInput
                placeholder="••••••••"
                icon="🔒"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>
            <Button
              type="submit"
              size="md"
              block
              disabled={loading}
              className="mt-1 bg-gradient-to-r from-navy-600 via-navy-500 to-gold-500 text-white"
            >
              {loading ? "Signing in…" : "Sign In →"}
            </Button>
          </form>

          <p className="mt-4 text-center text-[11.5px] text-navy-300">
            Demo: sara.ahmed@email.com · owner@techworld-store.com · moderator@proofly.ai — password: password123
          </p>
        </AuthCard>
        <AuthCaption />
      </div>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
