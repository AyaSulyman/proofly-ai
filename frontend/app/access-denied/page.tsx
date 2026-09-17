import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF1FB] to-white">
      <SiteHeader />
      <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center px-5 text-center">
        <div className="mb-4 flex h-18 w-18 items-center justify-center rounded-full border border-line bg-white text-3xl shadow-card-sm">
          🔒
        </div>
        <h2 className="mb-2 text-2xl font-bold text-navy-700">Access denied</h2>
        <p className="mb-6 max-w-[420px] text-sm leading-relaxed text-navy-300">
          You don&apos;t have permission to view this page. If you think this is a
          mistake, contact your Proofly admin or sign in with an account that has
          access.
        </p>
        <div className="flex gap-3.5">
          <Button href="/login" variant="gold">
            Switch Account →
          </Button>
          <Button href="/" variant="outline">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
