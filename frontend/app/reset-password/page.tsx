import { AuthShell, AuthCard } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
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
          Set a new <span className="text-gold-500">Password</span>
        </h1>
        <p className="mb-6 text-center text-[13.5px] leading-relaxed text-navy-300">
          Choose a strong password you haven&apos;t used before on Proofly.
        </p>
        <form action="/login" className="contents">
          <Field label="New Password">
            <Input type="password" placeholder="Enter new password" icon="🔒" required />
          </Field>
          <Field label="Confirm New Password">
            <Input type="password" placeholder="Re-enter new password" icon="🔒" required />
          </Field>
          <div className="mb-4.5 rounded-lg bg-navy-50 px-3.5 py-2.5 text-[11.5px] text-navy-300">
            Use 8+ characters with a mix of letters, numbers, and symbols.
          </div>
          <Button size="md" block className="bg-gradient-to-r from-navy-600 via-navy-500 to-gold-500 text-white">
            Reset Password →
          </Button>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
