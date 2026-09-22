"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { App } from "antd";

import {
  AuthCaption,
  AuthCard,
  AuthShell,
} from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import {
  Field,
  Input,
  PasswordInput,
} from "@/components/ui/input";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const role =
    searchParams.get("role") === "business"
      ? "business"
      : "consumer";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [error, setError] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const { message } = App.useApp();

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          confirmPassword,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const firstError = Object.values(data)[0];

        throw new Error(
          Array.isArray(firstError)
            ? String(firstError[0])
            : String(
                firstError || "Registration failed."
              )
        );
      }

      message.success(
        "Account created successfully."
      );

      router.push(
        role === "business"
          ? "/business/claim"
          : "/investigations"
      );

      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong.";

      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      cursive={"Join a safer\nonline world\ntoday."}
      topRight={
        <div className="flex items-center gap-3.5 text-sm text-navy-600">
          <span className="hidden sm:inline">
            Already have an account?
          </span>
<Button
  href="/login"
  variant="gold"
  size="sm"
  className="border-gold-300 bg-gold-500 !text-white hover:bg-gold-300 hover:!text-white"
>
  Sign In →
</Button>
        </div>
      }
    >
      <div>
        <AuthCard>
          <h1 className="mb-1.5 mt-3.5 text-center text-[26px] font-extrabold text-navy-700">
            Create your{" "}
            <span className="text-gold-500">
              Account
            </span>
          </h1>

          <p className="mb-6 text-center text-[13.5px] leading-relaxed text-navy-300">
            {role === "business"
              ? "Register your business to claim a verified profile."
              : "Join Proofly to investigate sellers, track disputes, and browse trust reports."}
          </p>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-line/80 bg-[#0B1423]/75 p-5 shadow-inner"
          >
            {error && (
              <div className="mb-4 rounded-lg border border-gold-500/25 bg-danger-bg px-3.5 py-2.5 text-[12.5px] text-danger">
                {error}
              </div>
            )}

            <Field label="Full Name">
              <Input
                type="text"
                placeholder="Aya Haddad"
                icon="👤"
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
                required
              />
            </Field>

            <Field label="Email Address">
              <Input
                type="email"
                placeholder="name@company.com"
                icon="✉️"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />
            </Field>

            <Field label="Password">
              <PasswordInput
                placeholder="Create a password"
                icon="🔒"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />
            </Field>

            <Field label="Confirm Password">
              <PasswordInput
                placeholder="Re-enter password"
                icon="🔒"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                required
              />
            </Field>

            <label className="mb-4 flex items-start gap-2 text-xs leading-relaxed text-navy-300">
              <input
                type="checkbox"
                className="mt-0.5 accent-gold-500"
                required
              />

              <span>
                I agree to Proofly&apos;s Terms of
                Service and Privacy Policy.
              </span>
            </label>

            <Button
              type="submit"
              size="md"
              variant="gold"
              block
              disabled={loading}
              className="mt-1 !text-[#070C16]"
            >
              {loading
                ? "Creating account…"
                : "Create Account →"}
            </Button>
          </form>
        </AuthCard>

        <AuthCaption />
      </div>
    </AuthShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}