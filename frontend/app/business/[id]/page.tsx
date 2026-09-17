import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Avatar } from "@/components/ui/avatar";
import { RiskBadge, VerificationBadge, Badge } from "@/components/ui/badge";
import { RiskRing } from "@/components/ui/risk-ring";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { businesses } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

const REVIEWS = [
  { name: "Layla K.", stars: 5, text: "Ordered a laptop and it arrived exactly as described, two days early. Seller responded fast to every question.", date: "3 days ago" },
  { name: "Omar F.", stars: 4, text: "Good experience overall, packaging could be better but the product was genuine and worked fine.", date: "1 week ago" },
  { name: "Nadine S.", stars: 5, text: "Second time buying from them. Consistent quality and honest pricing compared to similar listings.", date: "2 weeks ago" },
];

export default async function BusinessProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const biz = businesses.find((b) => b.id === id);
  if (!biz) return notFound();

  return (
    <div className="min-h-screen bg-bg">
      <SiteHeader />

      {/* Hero */}
      <div className="bg-gradient-to-br from-navy-600 to-navy-700 px-6 pb-24 pt-9 text-white md:px-12">
        <div className="mx-auto flex max-w-5xl flex-wrap items-start justify-between gap-7">
          <div className="flex items-center gap-4.5">
            {/* The business/seller profile image, front and center on their public page */}
            <Avatar
              src={biz.imageUrl}
              name={biz.name}
              size="xl"
              shape={biz.isIndividual ? "circle" : "rounded"}
              verified={biz.verificationStatus === "verified"}
            />
            <div>
              <h1 className="mb-2 text-2xl font-bold">{biz.name}</h1>
              <div className="flex flex-wrap gap-2">
                <VerificationBadge status={biz.verificationStatus} />
                <RiskBadge level={biz.riskLevel} />
                <Badge className="bg-white/15 text-white">{biz.category}</Badge>
              </div>
              <div className="mt-3.5 flex flex-wrap gap-5 text-[12.5px] text-navy-100/80">
                {biz.website && <span>🌐 {biz.website}</span>}
                {biz.location && <span>📍 {biz.location}</span>}
                <span>📅 On Proofly since {formatDate(biz.memberSince)}</span>
                <span>⭐ {biz.rating} ({biz.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2.5">
            <Button href={`/investigations/new?subject=${encodeURIComponent(biz.name)}`} variant="outline" size="sm" className="border-white/25 bg-white/10 text-white">
              🔎 Investigate
            </Button>
            <Button href="#write-review" variant="gold" size="sm">
              📝 Write a Review
            </Button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto -mt-14 max-w-5xl px-6 pb-16 md:px-12">
        <Card className="mb-6 flex flex-wrap items-center gap-6 shadow-card">
          <RiskRing score={biz.riskScore} level={biz.riskLevel} />
          <div className="min-w-[220px] flex-1">
            <b className="mb-1 block text-base">
              {biz.riskLevel === "low"
                ? "No significant risk signals detected."
                : biz.riskLevel === "medium"
                ? "A few risk signals worth reviewing."
                : "Multiple risk signals detected."}
            </b>
            <span className="text-[13px] leading-relaxed text-navy-300">
              Proofly surfaces risk signals based on verification status, evidence,
              and community reports — always use your own judgment before
              transacting.
            </span>
          </div>
          <Button variant="outline" size="sm">
            View Full Report →
          </Button>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div>
            <Card className="mb-5">
              <CardHeader title={`Community Reviews (${biz.reviewCount})`} action={<a className="text-xs font-bold text-info">See all →</a>} />
              <div className="mb-4 flex gap-5 border-b border-line pb-3 text-[13px] text-navy-300">
                <span className="border-b-2 border-gold-500 pb-3 font-semibold text-navy-700">Most Recent</span>
                <span>Highest Rated</span>
                <span>Flagged</span>
              </div>
              {REVIEWS.map((r, i) => (
                <div key={r.name} className={`py-3.5 ${i < REVIEWS.length - 1 ? "border-b border-line" : ""}`}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar name={r.name} size="xs" shape="circle" />
                      <b className="text-[13px]">{r.name}</b>
                    </div>
                    <span className="text-xs text-gold-500">{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</span>
                  </div>
                  <p className="text-[12.5px] leading-relaxed text-navy-300">{r.text}</p>
                  <span className="mt-1.5 block text-[11px] text-navy-100">{r.date}</span>
                </div>
              ))}
            </Card>
          </div>

          <div>
            <Card className="mb-5 bg-gradient-to-br from-navy-600 to-navy-500 text-center text-white">
              <b className="mb-2 block text-[14.5px]">
                Thinking of buying from {biz.name}?
              </b>
              <span className="mb-4 block text-[12.5px] text-navy-100/85">
                Start a free investigation to check this seller against your
                specific situation before you pay.
              </span>
              <Button href={`/investigations/new?subject=${encodeURIComponent(biz.name)}`} variant="gold" block>
                Start Investigation →
              </Button>
            </Card>

            <Card>
              <CardHeader title="Business Details" />
              {[
                ["Category", biz.category],
                ["Verification", biz.verificationStatus === "verified" ? "✓ Verified" : "Unverified"],
                ["Response rate", biz.responseRate ?? "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-line py-2 text-[12.5px] last:border-none">
                  <span className="text-navy-300">{k}</span>
                  <span className="font-semibold">{v}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

export function generateStaticParams() {
  return businesses.map((b) => ({ id: b.id }));
}
