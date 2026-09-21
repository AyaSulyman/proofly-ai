import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Consumer",
    price: "Free",
    period: "forever",
    audience: "For anyone checking a seller, business, or listing",
    features: [
      "Unlimited searches",
      "Unlimited investigations",
      "AI evidence analysis",
      "Community reports & reviews",
      "Dispute tracking",
      "Email notifications",
    ],
    cta: { label: "Create Free Account →", href: "/register" },
    highlight: false,
  },
  {
    name: "Business Verified",
    price: "$29",
    period: "/ month",
    audience: "For businesses that want a verified public profile",
    features: [
      "Everything in Consumer",
      "Verified badge on your profile",
      "Reputation dashboard",
      "Respond to reports & disputes",
      "Basic analytics",
      "Priority email support",
    ],
    cta: { label: "Claim Your Business →", href: "/business/claim" },
    highlight: true,
  },
  {
    name: "Business Pro",
    price: "$99",
    period: "/ month",
    audience: "For larger businesses managing high report volume",
    features: [
      "Everything in Verified",
      "Advanced risk & trend analytics",
      "Priority dispute resolution",
      "Team seats for multiple staff",
      "API access",
      "Dedicated account manager",
    ],
    cta: { label: "Talk to Sales →", href: "/for-businesses" },
    highlight: false,
  },
];

const FAQS = [
  {
    q: "Is Proofly really free for consumers?",
    a: "Yes — searching, starting investigations, submitting community reports, and tracking disputes are always free for consumers. There's no limit on how many investigations you can run.",
  },
  {
    q: "What does verification actually check?",
    a: "Verification confirms a business's email, phone, and submitted business documents. It doesn't guarantee every transaction will go smoothly, but it does confirm the business is a real, reachable entity — and gives them a formal way to respond to reports.",
  },
  {
    q: "Can I cancel a business plan anytime?",
    a: "Yes, business plans are billed monthly with no long-term contract. If you cancel, your profile stays live but loses the verified badge and dashboard features at the end of the billing period.",
  },
  {
    q: "Do you take a cut of transactions?",
    a: "No. Proofly never processes payments between buyers and sellers — we only provide risk information and verification, so there's nothing to take a cut of.",
  },
];

export default function PricingPage() {
  return (
    <>
      <SiteHeader />

      <section className="paper-texture bg-gradient-to-br from-[#fffaf4] to-[#eed9ce] px-6 py-16 text-center md:px-12">
        <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-bold text-navy-500 shadow-card-sm">
          💳 Pricing
        </span>
        <h1 className="display-type mx-auto mb-4 max-w-2xl text-[42px] font-bold leading-[1.08] text-navy-700 sm:text-[52px]">
          Free to investigate. <span className="text-gold-500">Paid to be verified.</span>
        </h1>
        <p className="mx-auto max-w-lg text-[14.5px] leading-relaxed text-navy-300">
          Consumers never pay. Businesses pay for the tools to build and prove
          their credibility.
        </p>
      </section>

      <section className="px-6 py-16 md:px-12">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-[26px] border p-7 transition hover:-translate-y-1",
                plan.highlight
                  ? "border-gold-500 bg-white shadow-card"
                  : "border-line bg-white"
              )}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-7 rounded-full bg-gradient-to-r from-gold-500 to-gold-300 px-3 py-1 text-[10.5px] font-extrabold text-navy-700">
                  MOST POPULAR
                </span>
              )}
              <b className="mb-1 text-[15px]">{plan.name}</b>
              <p className="mb-5 text-[12px] text-navy-300">{plan.audience}</p>
              <div className="mb-6 flex items-baseline gap-1.5">
                <span className="text-[32px] font-extrabold text-navy-700">{plan.price}</span>
                <span className="text-[12.5px] text-navy-300">{plan.period}</span>
              </div>
              <ul className="mb-7 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-navy-500">
                    <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-ok-bg text-[10px] text-ok">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                href={plan.cta.href}
                variant={plan.highlight ? "gold" : "outline"}
                block
              >
                {plan.cta.label}
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-20 md:px-12">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-navy-700">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.q} className="rounded-2xl border border-line p-5">
                <b className="mb-2 block text-[13.5px]">{f.q}</b>
                <p className="text-[12.5px] leading-relaxed text-navy-300">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wine-grid relative overflow-hidden bg-gradient-to-br from-navy-600 to-navy-700 px-6 py-16 text-center text-white md:px-12">
        <div className="mx-auto max-w-lg">
         <h2 className="mb-4 text-2xl font-bold !text-[#651B2B]">
  Still not sure which plan fits?
</h2>
          <p className="mb-7 text-sm text-navy-100/85">
            Consumers should just start with a free account. Businesses can talk
            to us first — no pressure.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5">
            <Button href="/register" variant="gold">
              Create Free Account →
            </Button>
            <Button href="/for-businesses" variant="outline" className="border-white/40 bg-white/10 text-white">
              For Businesses
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
