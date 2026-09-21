import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { BusinessIllustration } from "@/components/illustrations/business-illustration";

const BENEFITS = [
  { icon: "✅", title: "Verified badge", desc: "Stand out with a visible verification mark on your public profile." },
  { icon: "📊", title: "Reputation dashboard", desc: "See reviews, reports, and disputes in one place." },
  { icon: "⚖️", title: "Right to respond", desc: "Answer community reports directly through a structured dispute process." },
  { icon: "📈", title: "Build customer trust", desc: "Give buyers a reason to choose you over unverified sellers." },
];

const STEPS = [
  { n: "1", title: "Check your current listing", desc: "Search to see if customers have already investigated your business." },
  { n: "2", title: "Claim your profile", desc: "Create or take ownership of your business page on Proofly." },
  { n: "3", title: "Get verified", desc: "Submit basic documents — email, phone, and business proof." },
  { n: "4", title: "Respond with confidence", desc: "Address reports and disputes transparently, right from your dashboard." },
];

export default function ForBusinessesPage() {
  return (
    <>
      <SiteHeader />

      {/* Hero with search — the business entry point */}
      <section className="paper-texture bg-gradient-to-br from-[#fffaf4] to-[#e9d1c8] px-6 py-16 md:px-12 lg:py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
          <div className="max-w-[500px]">
            <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-bold text-navy-500 shadow-card-sm">
              🏢 For Businesses
            </span>
            <h1 className="display-type mb-5 text-[42px] font-bold leading-[1.08] text-navy-700 sm:text-[52px]">
              Build trust. Grow your <span className="text-gold-500">business.</span>
            </h1>
            <p className="mb-8 text-[14.5px] leading-relaxed text-navy-300">
              Customers are already investigating businesses like yours. Check
              whether you have an existing profile, then claim and verify it
              to show you&apos;re legitimate.
            </p>

            <form
              action="/search"
              className="mb-4 flex items-center gap-2 rounded-2xl border border-line bg-white p-1.5 shadow-card-sm"
            >
              <span className="pl-2.5 text-navy-300">🔍</span>
              <input
                name="q"
                placeholder="Search your business name or website…"
                className="flex-1 rounded-lg border-none px-2 py-2.5 text-sm outline-none"
              />
              <button className="rounded-lg bg-navy-600 px-5 py-2.5 text-sm font-semibold text-white">
                Search →
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-navy-300">Don&apos;t have a profile yet?</span>
              <Button href="/business/claim" variant="gold" size="sm">
                Claim Your Business →
              </Button>
            </div>
          </div>

          <BusinessIllustration className="w-[220px] shrink-0 rounded-3xl shadow-card sm:w-[260px]" />
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="mb-2.5 text-xs font-extrabold uppercase tracking-wide text-gold-500">
            Why Verify
          </p>
          <h2 className="display-type text-4xl font-bold text-navy-700">
            A verified profile is your best sales pitch.
          </h2>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2">
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex gap-4 rounded-2xl border border-line bg-white p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-lg">
                {b.icon}
              </div>
              <div>
                <b className="mb-1 block text-[14px]">{b.title}</b>
                <span className="text-[12.5px] leading-relaxed text-navy-300">{b.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works for businesses */}
      <section className="bg-white px-6 py-20 md:px-12">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="mb-2.5 text-xs font-extrabold uppercase tracking-wide text-gold-500">
            Your Path
          </p>
          <h2 className="display-type text-4xl font-bold text-navy-700">From search to verified.</h2>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-2xl border border-line p-5">
              <div className="mb-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-navy-600 text-sm font-bold text-white">
                {s.n}
              </div>
              <b className="mb-1.5 block text-[13.5px]">{s.title}</b>
              <span className="text-[12px] leading-relaxed text-navy-300">{s.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="wine-grid relative overflow-hidden bg-gradient-to-br from-navy-600 to-navy-700 px-6 py-20 text-center text-white md:px-12">
        <div className="mx-auto max-w-lg">
         <h2 className="mb-4 text-[27px] font-bold leading-snug !text-[#651B2B]">
  Start with a free business profile.
</h2>
          <p className="mb-7 text-sm text-navy-100/85">
            Verification tiers with analytics and priority dispute support are
            available on paid plans.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5">
            <Button href="/business/claim" variant="gold">
              Claim Your Business →
            </Button>
            <Button href="/pricing" variant="outline" className="border-white/40 bg-white/10 text-white">
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
