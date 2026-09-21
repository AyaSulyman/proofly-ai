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
    <header className="sticky top-0 z-30 border-b border-line/80 bg-[#fffdf9]/95 px-4 py-3.5 shadow-[0_6px_24px_rgba(66,21,29,.05)] backdrop-blur-xl sm:px-6 md:px-12">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
      <Logo />
      <nav className="hidden items-center gap-1 rounded-full border border-line bg-white/70 p-1 text-[13px] font-semibold text-navy-500 lg:flex">
        {NAV_LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="rounded-full px-3.5 py-2 hover:bg-navy-50 hover:text-navy-700">
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
