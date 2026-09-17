import Link from "next/link";
import { AuthShell, AuthCard } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      topRight={
        <Button href="/login" variant="outline" size="sm" className="border-white/50 bg-white/15 text-white backdrop-blur">
          Back to Sign In
        </Button>
      }
    >
      <AuthCard>
        <h1 className="mb-1.5 mt-3.5 text-center text-[26px] font-extrabold text-navy-700">
          Forgot your <span className="text-gold-500">Password?</span>
        </h1>
        <p className="mb-6 text-center text-[13.5px] leading-relaxed text-navy-300">
          Enter the email linked to your account and we&apos;ll send you a reset
          link.
        </p>
        <form action="/reset-password" className="contents">
          <Field label="Email Address">
            <Input type="email" placeholder="name@company.com" icon="✉️" required />
          </Field>
          <Button size="md" block className="mt-1 bg-gradient-to-r from-navy-600 via-navy-500 to-gold-500 text-white">
            Send Reset Link →
          </Button>
        </form>
        <p className="mt-4.5 text-center text-[12.5px] text-navy-300">
          Remembered your password?{" "}
          <Link href="/login" className="font-bold text-info">
            Sign in
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
