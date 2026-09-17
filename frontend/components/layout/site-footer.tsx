import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const COLUMNS = [
  {
    title: "Product",
    links: ["Overview", "Features", "Pricing", "Roadmap"],
  },
  {
    title: "For Consumers",
    links: ["Search", "Investigations", "Community", "Help Center"],
  },
  {
    title: "For Businesses",
    links: ["Claim Profile", "Verification", "Business Resources"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Blog", "Contact"],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white px-6 py-12 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-10">
        <div className="max-w-[220px]">
          <Logo />
          <div className="mt-4 flex gap-2.5">
            {["𝕏", "in", "◎", "▶"].map((s) => (
              <span
                key={s}
                className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-navy-50 text-xs text-navy-500"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h5 className="mb-3.5 text-[13px] font-bold text-navy-700">{col.title}</h5>
            {col.links.map((l) => (
              <Link
                key={l}
                href="#"
                className="mb-2 block text-[13px] text-navy-300 hover:text-navy-600"
              >
                {l}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="mx-auto mt-8 max-w-6xl border-t border-line pt-4 text-center text-xs text-navy-300">
        © 2026 Proofly AI. All rights reserved. · Privacy Policy · Terms of Service
      </div>
    </footer>
  );
}
