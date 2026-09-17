import { AuthShell } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/mock-data";

export default function VerifyEmailPage() {
  return (
    <AuthShell
      topRight={
        <Button href="/login" variant="outline" size="sm" className="border-white/50 bg-white/15 text-white backdrop-blur">
          Back to Sign In
        </Button>
      }
    >
      <div className="w-full max-w-[440px] rounded-[22px] bg-white/97 p-9 text-center shadow-card">
        <div className="mx-auto mb-4 flex h-15 w-15 items-center justify-center rounded-full bg-info-bg text-2xl text-info">
          ✉️
        </div>
        <h2 className="mb-2 text-xl font-bold text-navy-700">Check your inbox</h2>
        <p className="mb-5 text-[13.5px] leading-relaxed text-navy-300">
          We sent a verification link to confirm your account. Click the link to
          activate full access to Proofly AI.
        </p>
        <div className="mb-5 inline-block rounded-lg bg-navy-50 px-3.5 py-2.5 text-[13px] font-bold">
          {currentUser.email}
        </div>
        <Button block variant="navy" className="mb-3">
          Resend Email
        </Button>
        <Button block variant="outline" href="/login">
          I&apos;ve Verified — Sign In
        </Button>
      </div>
    </AuthShell>
  );
}
