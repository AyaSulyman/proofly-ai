import Link from "next/link";
import { AuthShell, AuthCard, AuthCaption } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <AuthShell
      cursive={"Smarter\nDecisions\nBrighter\nTomorrow."}
      topRight={
        <div className="flex items-center gap-3.5 text-sm text-navy-600">
          <span className="hidden sm:inline">Don&apos;t have an account?</span>
          <Button href="/register" variant="gold" size="sm">
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

          <form action="/investigations" className="contents">
            <Field label="Email Address">
              <Input type="email" placeholder="name@company.com" icon="✉️" required />
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
              <Input type="password" placeholder="••••••••" icon="🔒" required />
            </Field>
            <Button size="md" block className="mt-1 bg-gradient-to-r from-navy-600 via-navy-500 to-gold-500 text-white">
              Sign In →
            </Button>
          </form>

          <div className="my-4.5 flex items-center gap-2.5 text-[11px] tracking-wide text-navy-300">
            <span className="h-px flex-1 bg-line" />
            OR CONTINUE WITH
            <span className="h-px flex-1 bg-line" />
          </div>
          <div className="flex gap-2.5">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line py-2.5 text-[13px] font-semibold">
              🔴 Google
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line py-2.5 text-[13px] font-semibold">
               Apple
            </button>
          </div>
        </AuthCard>
        <AuthCaption />
      </div>
    </AuthShell>
  );
}
