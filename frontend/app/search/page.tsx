import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Avatar } from "@/components/ui/avatar";
import { RiskBadge, VerificationBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { businesses } from "@/lib/mock-data";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query
    ? businesses.filter((b) =>
        b.name.toLowerCase().includes(query.toLowerCase())
      )
    : businesses;

  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-6 py-8 md:px-12">
        <form className="mb-5 flex items-center gap-2 rounded-2xl border border-line bg-white p-1.5 shadow-card-sm">
          <span className="pl-2.5 text-navy-300">🔍</span>
          <input
            name="q"
            defaultValue={query}
            placeholder="Search a name, business, phone, email, website…"
            className="flex-1 rounded-lg border-none px-2 py-2.5 text-sm outline-none"
          />
          <button className="rounded-lg bg-navy-600 px-6 py-2.5 text-sm font-semibold text-white">
            Search
          </button>
        </form>

        <div className="mb-4 flex flex-wrap gap-2.5">
          {["All", "Businesses", "Sellers", "Websites"].map((f, i) => (
            <span
              key={f}
              className={`rounded-full border px-4 py-2 text-[12.5px] font-semibold ${
                i === 0
                  ? "border-navy-600 bg-navy-600 text-white"
                  : "border-line bg-white text-navy-300"
              }`}
            >
              {f}
            </span>
          ))}
        </div>

        <p className="mb-4 text-[13px] text-navy-300">
          <b className="text-navy-700">{results.length} results</b>
          {query ? ` found for "${query}"` : ""} · sorted by relevance
        </p>

        <div className="space-y-3">
          {results.map((biz) => (
            <div
              key={biz.id}
              className="flex flex-wrap items-center gap-4.5 rounded-2xl border border-line bg-white p-4.5 transition hover:shadow-card-sm"
            >
              {/* Profile image: business/seller/individual photo, with initials fallback */}
              <Avatar
                src={biz.imageUrl}
                name={biz.name}
                size="md"
                shape={biz.isIndividual ? "circle" : "rounded"}
              />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2.5">
                  <b className="text-[15.5px]">{biz.name}</b>
                  <VerificationBadge status={biz.verificationStatus} />
                  <RiskBadge level={biz.riskLevel} />
                </div>
                <div className="flex flex-wrap gap-4 text-[12.5px] text-navy-300">
                  {biz.website && <span>🌐 {biz.website}</span>}
                  {biz.location && <span>📍 {biz.location}</span>}
                  <span>⭐ {biz.rating} ({biz.reviewCount} reviews)</span>
                </div>
              </div>
              <Button href={`/business/${biz.id}`} variant="outline" size="sm">
                View Profile →
              </Button>
            </div>
          ))}

          {results.length === 0 && (
            <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
              <p className="mb-4 text-sm text-navy-300">
                We couldn&apos;t find &quot;{query}&quot; in Proofly yet. That
                doesn&apos;t confirm it&apos;s safe — start an investigation to
                check it properly.
              </p>
              <Link
                href="/investigations/new"
                className="inline-flex items-center gap-2 rounded-full bg-navy-600 px-6 py-3 text-sm font-semibold text-white"
              >
                Start Investigation →
              </Link>
            </div>
          )}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
