import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Product", href: "/#features" },
  { label: "Search", href: "/search" },
  { label: "For Consumers", href: "/for-consumers" },
  { label: "For Businesses", href: "/for-businesses" },
  { label: "Pricing", href: "/pricing" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-[#070c16]/95 px-4 py-4 shadow-[0_10px_30px_rgba(0,0,0,.3)] backdrop-blur-xl sm:px-6 md:px-12">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
      <Logo />
      <nav className="hidden items-center gap-1 rounded-full border border-line bg-white/5 p-1 text-[13px] font-semibold text-navy-100 lg:flex">
        {NAV_LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="rounded-full px-3.5 py-2 hover:bg-gold-500/10 hover:text-gold-300">
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2 sm:gap-3">
        <Button href="/login" variant="outline" size="sm">
          Sign In
        </Button>
        <Button href="/register" variant="navy" size="sm" className="hidden sm:inline-flex">
          Get Started →
        </Button>
      </div>
      </div>
    </header>
  );
}
