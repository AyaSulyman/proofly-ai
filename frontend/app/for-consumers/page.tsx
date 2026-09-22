import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  House,
  MessageSquareWarning,
  Search,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { ConsumerIllustration } from "@/components/illustrations/consumer-illustration";

const REASONS = [
  {
    icon: ShoppingBag,
    title: "Before you buy from a seller",
    desc: "Review marketplace listings, social sellers, and unfamiliar payment requests before purchasing.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Before you hire a freelancer",
    desc: "Check reviews, verification details, previous reports, and dispute history.",
  },
  {
    icon: House,
    title: "Before you book a rental",
    desc: "Verify the host, business, and listing before sending a deposit or sharing information.",
  },
  {
    icon: MessageSquareWarning,
    title: "When a message feels suspicious",
    desc: "Upload a suspicious message and let Proofly identify potential risk language.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Search first",
    desc: "Check whether the seller, website, or business already has a Proofly trust profile.",
  },
  {
    n: "02",
    title: "Start an investigation",
    desc: "Add screenshots, links, messages, documents, and any other useful evidence.",
  },
  {
    n: "03",
    title: "Review your report",
    desc: "See the risk score, detected signals, evidence summary, and related identifiers.",
  },
  {
    n: "04",
    title: "Decide confidently",
    desc: "Use the transparent findings to report the issue or continue more safely.",
  },
];

export default function ForConsumersPage() {
  return (
    <>
      <SiteHeader />

      {/* Hero */}
      <section className="wine-grid relative overflow-hidden border-b border-line bg-[radial-gradient(circle_at_82%_45%,rgba(88,212,210,.12),transparent_24rem),linear-gradient(135deg,#070C16_0%,#0B1423_55%,#111D2F_100%)] px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-22">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

        <div className="relative mx-auto grid min-h-[540px] max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
          {/* Left content */}
          <div className="order-2 max-w-[640px] lg:order-1">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-500/35 bg-gold-500/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-gold-300 sm:text-xs">
              <ShieldCheck size={16} />
              Built for safer consumer decisions
            </span>

            <h1 className="display-type mb-6 text-[43px] font-bold leading-[1.05] tracking-[-0.035em] text-white sm:text-[56px] lg:text-[66px]">
              Check before
              <span className="block text-gold-300">
                you pay.
              </span>
            </h1>

            <p className="mb-8 max-w-[590px] text-[15px] leading-7 text-navy-100 sm:text-base sm:leading-8">
              Search an unfamiliar seller, business, listing, or website before
              making a payment. If no record exists, start an investigation and
              let Proofly analyze your evidence for clear, explainable risk
              signals.
            </p>

            <form
              action="/search"
              className="panel-surface mb-5 flex max-w-[620px] items-center gap-2 rounded-2xl p-2 shadow-card sm:gap-3"
            >
              <Search
                size={20}
                className="ml-2 shrink-0 text-info sm:ml-3"
              />

              <input
                name="q"
                aria-label="Search Proofly"
                placeholder="Search a seller, business, phone, or website"
                className="min-w-0 flex-1 border-0 bg-transparent px-1 py-3 text-[13px] text-white outline-none placeholder:text-navy-300 sm:text-sm"
              />

              <button
                type="submit"
                className="flex shrink-0 items-center gap-2 rounded-xl bg-gold-500 px-4 py-3 text-sm font-bold !text-white hover:bg-gold-300 hover:!text-white sm:px-5"
              >
                <span className="hidden sm:inline">Search</span>
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="mb-8 flex flex-wrap gap-x-5 gap-y-2.5 text-xs font-medium text-navy-100">
              {[
                "Public websites",
                "Businesses",
                "Sellers",
                "Digital evidence",
              ].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5"
                >
                  <Check size={14} className="text-info" />
                  {item}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                href="/investigations/new"
                variant="gold"
                className="border-gold-300 bg-gold-500 !text-white hover:bg-gold-300 hover:!text-white"
              >
                Start an Investigation
                <ArrowRight size={16} />
              </Button>

              <span className="text-center text-xs text-navy-300 sm:text-left">
                No existing record is required.
              </span>
            </div>
          </div>

          {/* Right illustration */}
          <div className="order-1 flex items-center justify-center lg:order-2 lg:justify-end">
            <div className="relative w-full max-w-[390px]">
              <div className="absolute inset-8 rounded-full bg-info/10 blur-3xl" />

              <div className="panel-surface relative overflow-hidden rounded-[30px] border-gold-500/25 p-5 shadow-card sm:p-7">
                <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent" />

                <ConsumerIllustration className="relative mx-auto w-full max-w-[310px] rounded-2xl" />

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-line bg-[#0B1423] p-3.5">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-info">
                      Private
                    </span>

                    <b className="text-[13px]">
                      Evidence protected
                    </b>
                  </div>

                  <div className="rounded-xl border border-line bg-[#0B1423] p-3.5">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-gold-300">
                      Transparent
                    </span>

                    <b className="text-[13px]">
                      Signals explained
                    </b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reasons */}
      <section className="px-5 py-18 sm:px-8 sm:py-22 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-info">
              When to use Proofly
            </p>

            <h2 className="display-type mb-4 text-[34px] font-bold leading-tight text-white sm:text-[44px] lg:text-5xl">
              A quick check before every risky decision.
            </h2>

            <p className="text-[15px] leading-7 text-navy-300 sm:text-base">
              Use Proofly whenever a seller, listing, message, or payment
              request makes you uncertain.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
            {REASONS.map((reason) => {
              const Icon = reason.icon;

              return (
                <article
                  key={reason.title}
                  className="panel-surface flex min-h-[160px] gap-4 rounded-2xl p-6 transition hover:-translate-y-1 hover:border-gold-500/40 lg:p-7"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-info/25 bg-info/10 text-info">
                    <Icon size={22} />
                  </div>

                  <div>
                    <h3 className="mb-2 text-base font-bold text-white">
                      {reason.title}
                    </h3>

                    <p className="text-[13.5px] leading-6 text-navy-300">
                      {reason.desc}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Consumer process */}
      <section className="border-y border-line bg-[#0A1220] px-5 py-18 sm:px-8 sm:py-22 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-gold-300">
              Your path
            </p>

            <h2 className="display-type mb-4 text-[34px] font-bold leading-tight text-white sm:text-[44px] lg:text-5xl">
              From search to a safer decision.
            </h2>

            <p className="text-[15px] leading-7 text-navy-300 sm:text-base">
              Four clear steps take you from uncertainty to an evidence-based
              result.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <article
                key={step.n}
                className="panel-surface relative min-h-[230px] overflow-hidden rounded-2xl p-6 transition hover:-translate-y-1 hover:border-gold-500/40"
              >
                <span className="absolute right-5 top-3 text-5xl font-black text-white/5">
                  {step.n}
                </span>

                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-gold-500/30 bg-gold-500/10 text-sm font-bold text-gold-300">
                  {step.n}
                </div>

                <h3 className="mb-2 text-base font-bold text-white">
                  {step.title}
                </h3>

                <p className="text-[13px] leading-6 text-navy-300">
                  {step.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-18 sm:px-8 sm:py-22 lg:px-12 lg:py-24">
        <div className="wine-grid relative mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-gold-500/30 bg-[radial-gradient(circle_at_82%_40%,rgba(88,212,210,.12),transparent_22rem),#0B1423] px-6 py-12 text-center shadow-card sm:px-10 sm:py-14">
          <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent" />

          <div className="relative mx-auto max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-info">
              Start with confidence
            </p>

            <h2 className="display-type mb-4 text-[34px] font-bold leading-tight text-gold-300 sm:text-[44px]">
              Free for consumers. Always.
            </h2>

            <p className="mx-auto mb-8 max-w-xl text-[15px] leading-7 text-navy-100">
              Create an account to save investigations, track disputes, update
              evidence, and receive notifications when your reports are ready.
            </p>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                href="/register"
                variant="gold"
                className="border-gold-300 bg-gold-500 !text-white hover:bg-gold-300 hover:!text-white"
              >
                Create Free Account
                <ArrowRight size={16} />
              </Button>

              <Button
                href="/login"
                variant="outline"
                className="border-gold-300 bg-transparent !text-white hover:bg-gold-500 hover:!text-white"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}