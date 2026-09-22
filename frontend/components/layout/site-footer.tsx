import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const COLUMNS = [
  {
    title: "Product",
    links: [["Overview", "/"], ["Pricing", "/pricing"]],
  },
  {
    title: "For Consumers",
    links: [["Search", "/search"], ["Investigations", "/investigations"], ["Community Reports", "/reports"]],
  },
  {
    title: "For Businesses",
    links: [["Claim Profile", "/business/claim"], ["Business Resources", "/for-businesses"]],
  },
  {
    title: "Company",
    links: [["For Consumers", "/for-consumers"], ["Sign In", "/login"], ["Create Account", "/register"]],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-navy-700 px-6 py-14 text-white md:px-12">
      <div className="wine-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto flex max-w-6xl flex-wrap justify-between gap-10">
        <div className="max-w-[220px]">
            <Logo dark />
            <p className="mt-4 text-xs leading-relaxed text-navy-100">Clear evidence for safer online decisions.</p>
          <div className="mt-4 flex gap-2.5">
            {["𝕏", "in", "◎", "▶"].map((s) => (
              <span
                key={s}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xs text-white hover:bg-white/20"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      {COLUMNS.map((column) => (
  <div key={column.title}>
    <h5 className="mb-4 text-[12px] font-bold uppercase tracking-[0.14em] !text-[#F4D58A]">
      {column.title}
    </h5>

    <nav className="space-y-2.5" aria-label={column.title}>
      {column.links.map(([label, href]) => (
        <Link
          key={`${label}-${href}`}
          href={href}
          className="block text-[13px] font-medium !text-[#F4D58A] hover:translate-x-0.5 hover:!text-white"
        >
          {label}
        </Link>
      ))}
    </nav>
  </div>
))}
      </div>
      <div className="relative mx-auto mt-10 max-w-6xl border-t border-white/10 pt-5 text-center text-xs text-navy-100">
        © 2026 Proofly AI. All rights reserved. · Privacy Policy · Terms of Service
      </div>
    </footer>
  );
}
