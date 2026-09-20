import { AuthShell, AuthCard } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { isAuthenticated } from "@/lib/session";
import { claimBusiness } from "./actions";

export default async function ClaimBusinessPage() {
  const loggedIn = await isAuthenticated();

  return (
    <AuthShell>
      <AuthCard>
        <h1 className="mb-1.5 mt-3.5 text-center text-2xl font-extrabold text-navy-700">
          Claim your <span className="text-gold-500">Business</span>
        </h1>
        <p className="mb-6 text-center text-[13.5px] leading-relaxed text-navy-300">
          Create a verified profile so customers can see you&apos;re legitimate.
        </p>

        {!loggedIn ? (
          <>
            <p className="mb-4 text-center text-[12.5px] text-navy-300">
              Create a business account first, then come back here to claim your profile.
            </p>
            <Button href="/register?role=business" block className="bg-gradient-to-r from-navy-600 via-navy-500 to-gold-500 text-white">
              Create Business Account →
            </Button>
          </>
        ) : (
          <form action={claimBusiness}>
            <Field label="Business Name">
              <Input name="name" placeholder="e.g. TechWorld Store" required />
            </Field>
            <Field label="Business Email">
              <Input name="email" type="email" placeholder="contact@yourbusiness.com" required />
            </Field>
            <Field label="Category">
              <Input name="category" placeholder="e.g. Electronics & Gadgets" />
            </Field>
            <Field label="Website (optional)">
              <Input name="website" placeholder="yourbusiness.com" />
            </Field>
            <Button type="submit" block className="mt-1 bg-gradient-to-r from-navy-600 via-navy-500 to-gold-500 text-white">
              Claim Business →
            </Button>
          </form>
        )}
      </AuthCard>
    </AuthShell>
  );
}
