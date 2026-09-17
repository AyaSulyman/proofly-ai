import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF1FB] to-white">
      <SiteHeader />
      <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center px-5 text-center">
        <div className="bg-gradient-to-r from-navy-600 to-gold-500 bg-clip-text text-[110px] font-extrabold leading-none text-transparent">
          404
        </div>
        <h2 className="mb-2 mt-3 text-2xl font-bold text-navy-700">
          This page went uninvestigated.
        </h2>
        <p className="mb-6 max-w-[420px] text-sm leading-relaxed text-navy-300">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
          Let&apos;s get you back to somewhere safe.
        </p>
        <div className="flex gap-3.5">
          <Button href="/" variant="gold">
            Back to Home →
          </Button>
          <Button href="/search" variant="outline">
            Search Proofly
          </Button>
        </div>
      </div>
    </div>
  );
}
