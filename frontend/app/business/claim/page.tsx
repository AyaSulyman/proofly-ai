import { AuthShell, AuthCard } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";

export default function ClaimBusinessPage() {
  return (
    <AuthShell>
      <AuthCard>
        <h1 className="mb-1.5 mt-3.5 text-center text-2xl font-extrabold text-navy-700">
          Claim your <span className="text-gold-500">Business</span>
        </h1>
        <p className="mb-6 text-center text-[13.5px] leading-relaxed text-navy-300">
          Create a verified profile so customers can see you&apos;re legitimate.
        </p>
        <form action="/register" className="contents">
          <Field label="Business Name">
            <Input placeholder="e.g. TechWorld Store" required />
          </Field>
          <Field label="Business Email">
            <Input type="email" placeholder="contact@yourbusiness.com" required />
          </Field>
          <Button block className="mt-1 bg-gradient-to-r from-navy-600 via-navy-500 to-gold-500 text-white">
            Continue →
          </Button>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
