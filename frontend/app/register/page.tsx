import { AuthShell, AuthCard, AuthCaption } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";

export default function RegisterPage() {
  return (
    <AuthShell
      cursive={"Join a safer\nonline world\ntoday."}
      topRight={
        <div className="flex items-center gap-3.5 text-sm text-navy-600">
          <span className="hidden sm:inline">Already have an account?</span>
          <Button href="/login" variant="gold" size="sm">
            Sign In →
          </Button>
        </div>
      }
    >
      <div>
        <AuthCard>
          <h1 className="mb-1.5 mt-3.5 text-center text-[26px] font-extrabold text-navy-700">
            Create your <span className="text-gold-500">Account</span>
          </h1>
          <p className="mb-6 text-center text-[13.5px] leading-relaxed text-navy-300">
            Join Proofly to investigate sellers, track disputes, and browse trust
            reports.
          </p>

          <form action="/verify-email" className="contents">
            <Field label="Full Name">
              <Input type="text" placeholder="Aya Haddad" icon="👤" required />
            </Field>
            <Field label="Email Address">
              <Input type="email" placeholder="name@company.com" icon="✉️" required />
            </Field>
            <Field label="Password">
              <Input type="password" placeholder="Create a password" icon="🔒" required />
            </Field>
            <Field label="Confirm Password">
              <Input type="password" placeholder="Re-enter password" icon="🔒" required />
            </Field>
            <label className="mb-4 flex items-start gap-2 text-xs leading-relaxed text-navy-300">
              <input type="checkbox" className="mt-0.5" required />
              I agree to Proofly&apos;s Terms of Service and Privacy Policy.
            </label>
            <Button
              size="md"
              block
              className="mt-1 bg-gradient-to-r from-navy-600 via-navy-500 to-gold-500 text-white"
            >
              Create Account →
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
