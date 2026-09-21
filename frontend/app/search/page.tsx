import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Avatar } from "@/components/ui/avatar";
import { RiskBadge, VerificationBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { publicFetch, ApiError } from "@/lib/session";
import type { Business } from "@/lib/types";

interface PaginatedBusinesses {
  count: number;
  results: Business[];
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { q, type } = await searchParams;
  const query = q?.trim() ?? "";
  const activeType = ["all", "business", "individual", "website"].includes(type || "") ? type! : "all";

  let results: Business[] = [];
  let error: string | null = null;
  try {
    const data = await publicFetch<PaginatedBusinesses>(
      "/api/businesses/?q=" + encodeURIComponent(query) + "&type=" + encodeURIComponent(activeType)
    );
    results = data.results;
  } catch (err) {
    error = err instanceof ApiError
      ? "Search failed (" + err.status + "). Please check the search details and try again."
      : "Search is temporarily unavailable. Please try again shortly.";
  }

  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader />
      <div className="paper-texture border-b border-line bg-gradient-to-br from-[#fffaf4] to-[#eed9ce] px-6 py-12 text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-navy-500">Proofly directory</p>
        <h1 className="display-type text-4xl font-bold text-navy-700 sm:text-5xl">Find the truth before you transact.</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-navy-300">Search verified businesses, sellers, and websites in one trusted place.</p>
      </div>
      <div className="mx-auto max-w-5xl px-6 py-8 md:px-12">
        <form className="-mt-14 mb-6 flex items-center gap-2 rounded-2xl border border-white bg-white p-2 shadow-card">
          <span className="pl-2.5 text-navy-300">🔍</span>
          <input
            name="q"
            defaultValue={query}
            placeholder="Search a name, business, phone, email, website…"
            className="flex-1 rounded-lg border-none px-2 py-2.5 text-sm outline-none"
          />
          <input type="hidden" name="type" value={activeType} />
          <button className="rounded-xl bg-navy-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-700">
            Search
          </button>
        </form>

        <div className="mb-4 flex flex-wrap gap-2.5">
          {[["All", "all"], ["Businesses", "business"], ["Sellers", "individual"], ["Websites", "website"]].map(([label, value]) => (
            <Link
              key={value}
              href={"/search?q=" + encodeURIComponent(query) + "&type=" + value}
              className={`rounded-xl border px-4 py-2 text-[12.5px] font-semibold ${
                activeType === value
                  ? "border-navy-600 bg-navy-600 text-white shadow-card-sm"
                  : "border-line bg-white text-navy-300 hover:border-gold-500 hover:text-navy-700"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {error ? (
          <div className="rounded-2xl border border-dashed border-danger-bg bg-white p-10 text-center text-sm text-danger">
            {error}
          </div>
        ) : (
          <>
            <p className="mb-4 text-[13px] text-navy-300">
              <b className="text-navy-700">{results.length} results</b>
              {query ? ` found for "${query}"` : ""} · sorted by relevance
            </p>

            <div className="space-y-3">
              {results.map((biz) => (
                <div
                  key={biz.id}
                  className="flex flex-wrap items-center gap-4.5 rounded-[22px] border border-line bg-white p-5 shadow-[0_5px_18px_rgba(66,21,29,.035)] transition hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-card-sm"
                >
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
                <div className="rounded-[26px] border border-dashed border-gold-500 bg-white p-12 text-center shadow-card-sm">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50 text-2xl">⌕</div>
                  <p className="mb-4 text-sm text-navy-300">
                    No results found{query ? <> for &quot;{query}&quot;</> : null}. That
                    doesn&apos;t confirm it&apos;s safe — start an investigation to
                    check it properly.
                  </p>
                 <Link
  href="/investigations/new"
  className="inline-flex items-center gap-2 rounded-xl bg-navy-600 px-6 py-3 text-sm font-semibold !text-white hover:bg-navy-700 hover:!text-white"
>
  Start Investigation →
</Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
