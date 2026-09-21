import { AuthShell, AuthCard } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/lib/session";
import { ClaimForm } from "./claim-form";

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
          <ClaimForm />
        )}
      </AuthCard>
    </AuthShell>
  );
}
