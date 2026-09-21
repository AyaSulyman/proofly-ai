import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { ConsumerIllustration } from "@/components/illustrations/consumer-illustration";

const REASONS = [
  { icon: "🛍️", title: "Before you buy from a seller", desc: "Marketplace listings, social sellers, or anyone asking for payment." },
  { icon: "💼", title: "Before you hire a freelancer", desc: "Check reviews, verification status, and past dispute history." },
  { icon: "🏠", title: "Before you book a rental", desc: "Verify the host and listing before sending a deposit." },
  { icon: "💬", title: "When a message feels off", desc: "Screenshot a suspicious DM and let AI flag risk language." },
];

const STEPS = [
  { n: "1", title: "Search first", desc: "Check if the seller or business already has a Proofly trust profile." },
  { n: "2", title: "No record? Start an investigation", desc: "Add your evidence — screenshots, links, chats — and let AI do the analysis." },
  { n: "3", title: "Get a transparent report", desc: "A risk score, key signals, and any connections to other flagged accounts." },
  { n: "4", title: "Decide with confidence", desc: "Report it to help others, or move forward knowing what you know." },
];

export default function ForConsumersPage() {
  return (
    <>
      <SiteHeader />

      {/* Hero with search — the consumer entry point */}
      <section className="paper-texture bg-gradient-to-br from-[#fffaf4] to-[#eed9ce] px-6 py-16 md:px-12 lg:py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
          <div className="max-w-[500px]">
            <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-bold text-navy-500 shadow-card-sm">
              👤 For Consumers
            </span>
            <h1 className="display-type mb-5 text-[42px] font-bold leading-[1.08] text-navy-700 sm:text-[52px]">
              Check before you <span className="text-gold-500">pay.</span>
            </h1>
            <p className="mb-8 text-[14.5px] leading-relaxed text-navy-300">
              Search an unfamiliar seller, business, or listing first. If
              nobody has checked it yet, start an investigation and let
              Proofly&apos;s AI analyze your evidence for risk signals.
            </p>

            <form
              action="/search"
              className="mb-4 flex items-center gap-2 rounded-2xl border border-line bg-white p-1.5 shadow-card-sm"
            >
              <span className="pl-2.5 text-navy-300">🔍</span>
              <input
                name="q"
                placeholder="Search a seller, business, phone, or website…"
                className="flex-1 rounded-lg border-none px-2 py-2.5 text-sm outline-none"
              />
              <button className="rounded-lg bg-navy-600 px-5 py-2.5 text-sm font-semibold text-white">
                Search →
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-navy-300">No existing record?</span>
              <Button href="/investigations/new" variant="gold" size="sm">
                Start a New Investigation →
              </Button>
            </div>
          </div>

          <ConsumerIllustration className="w-[220px] shrink-0 rounded-3xl shadow-card sm:w-[260px]" />
        </div>
      </section>

      {/* When to use it */}
      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="mb-2.5 text-xs font-extrabold uppercase tracking-wide text-gold-500">
            When to Use Proofly
          </p>
          <h2 className="display-type text-4xl font-bold text-navy-700">
            A quick check before every risky click.
          </h2>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2">
          {REASONS.map((r) => (
            <div key={r.title} className="flex gap-4 rounded-2xl border border-line bg-white p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-lg">
                {r.icon}
              </div>
              <div>
                <b className="mb-1 block text-[14px]">{r.title}</b>
                <span className="text-[12.5px] leading-relaxed text-navy-300">{r.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works for consumers */}
      <section className="bg-white px-6 py-20 md:px-12">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="mb-2.5 text-xs font-extrabold uppercase tracking-wide text-gold-500">
            Your Path
          </p>
          <h2 className="display-type text-4xl font-bold text-navy-700">From search to a safer decision.</h2>
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
          <h2 className="mb-4 text-[27px] font-bold leading-snug text-[#651B2B]">
  Free for consumers. Always.
</h2>
          <p className="mb-7 text-sm text-navy-100/85">
            Create an account to save investigations, track disputes, and get
            notified the moment your report is ready.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5">
            <Button href="/register" variant="gold">
              Create Free Account →
            </Button>
            <Button href="/login" variant="outline" className="border-white/40 bg-white/10 text-white">
              Sign In
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
