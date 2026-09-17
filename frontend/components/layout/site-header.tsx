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
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white px-6 py-4 md:px-12">
      <Logo />
      <nav className="hidden items-center gap-7 text-sm font-medium text-navy-500 md:flex">
        {NAV_LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="hover:text-navy-700">
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <Button href="/login" variant="outline" size="sm">
          Sign In
        </Button>
        <Button href="/register" variant="gold" size="sm">
          Get Started →
        </Button>
      </div>
    </header>
  );
}
