import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  Check,
  Gavel,
  Search,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { BusinessIllustration } from "@/components/illustrations/business-illustration";

const BENEFITS = [
  {
    icon: BadgeCheck,
    title: "A visible verified badge",
    desc: "Show customers that your identity and business details have been checked.",
  },
  {
    icon: BarChart3,
    title: "One reputation dashboard",
    desc: "Monitor customer reviews, reports, disputes, and profile activity in one place.",
  },
  {
    icon: Gavel,
    title: "A fair right to respond",
    desc: "Reply to community reports through a clear, structured dispute process.",
  },
  {
    icon: TrendingUp,
    title: "Stronger customer trust",
    desc: "Give buyers a clear reason to choose your verified business with confidence.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Find your listing",
    desc: "Search Proofly to see whether customers have already investigated your business.",
  },
  {
    n: "02",
    title: "Claim your profile",
    desc: "Create a new business page or request ownership of an existing profile.",
  },
  {
    n: "03",
    title: "Complete verification",
    desc: "Confirm your email, phone number, website, and supporting business details.",
  },
  {
    n: "04",
    title: "Build trust openly",
    desc: "Track feedback, answer disputes, and keep your public information current.",
  },
];

export default function ForBusinessesPage() {
  return (
    <>
      <SiteHeader />

      <main className="overflow-hidden bg-[#08111F] text-[#F7F1E3]">
        <section className="paper-texture relative border-b border-[#E7B857]/20 px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="pointer-events-none absolute -left-32 top-8 h-80 w-80 rounded-full bg-[#16C8C8]/10 blur-[110px]" />
          <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-[#E7B857]/10 blur-[130px]" />

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.04fr_.96fr] lg:gap-20">
            <div className="order-2 max-w-2xl lg:order-1">
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E7B857]/35 bg-[#E7B857]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#F1C96A]">
                <Building2 size={15} aria-hidden="true" />
                For Businesses
              </span>

              <h1 className="display-type max-w-[650px] text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-[#F7F1E3] sm:text-5xl lg:text-[64px]">
                Build confidence around your{" "}
                <span className="text-[#E7B857]">business.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-[#D8D3C7] sm:text-lg">
                Find your Proofly listing, claim ownership, and create a verified
                profile that helps customers recognize a legitimate business.
              </p>

              <form
                action="/search"
                className="mt-8 flex max-w-xl flex-col gap-2 rounded-2xl border border-[#E7B857]/25 bg-[#101A2A]/90 p-2 shadow-[0_20px_70px_rgba(0,0,0,.3)] sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                  <Search className="shrink-0 text-[#16C8C8]" size={19} aria-hidden="true" />
                  <input
                    name="q"
                    type="search"
                    aria-label="Search your business"
                    placeholder="Business name, website, phone, or email"
                    className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#F7F1E3] outline-none placeholder:text-[#A9A79F]"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#E7B857] px-6 text-sm font-bold !text-[#08111F] transition hover:bg-[#F1C96A] hover:shadow-[0_0_24px_rgba(231,184,87,.28)]"
                >
                  Search
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </form>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
                <span className="text-sm text-[#C8C4BA]">No profile yet?</span>
                <Button
                  href="/business/claim"
                  variant="gold"
                  size="sm"
                  className="border-[#E7B857] bg-[#E7B857] !text-white hover:bg-[#F1C96A] hover:!text-white"
                >
                  Claim Your Business
                  <ArrowRight size={15} />
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#E7B857]/15 pt-6 text-sm text-[#D8D3C7]">
                {["Free profile", "Clear verification", "Transparent responses"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <Check size={15} className="text-[#16C8C8]" aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
              <div className="relative w-full max-w-[500px]">
                <div className="absolute inset-8 rounded-full bg-[#16C8C8]/15 blur-[80px]" />
                <div className="relative rounded-[32px] border border-[#E7B857]/25 bg-[#101A2A]/65 p-5 shadow-[0_30px_90px_rgba(0,0,0,.45)] sm:p-8">
                  <BusinessIllustration className="mx-auto w-full max-w-[420px]" />
                  <div className="absolute -bottom-5 left-4 right-4 flex items-center gap-3 rounded-2xl border border-[#E7B857]/30 bg-[#0B1423]/95 p-4 shadow-2xl sm:left-10 sm:right-10">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#16C8C8]/15 text-[#16C8C8]">
                      <ShieldCheck size={23} aria-hidden="true" />
                    </span>
                    <div>
                      <b className="block text-sm text-[#F7F1E3]">Verification customers can see</b>
                      <span className="mt-0.5 block text-xs leading-5 text-[#C8C4BA]">
                        Clear credentials, contact details, and reputation signals.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#16C8C8]">
                Why verify
              </p>
              <h2 className="display-type text-3xl font-bold leading-tight text-[#F7F1E3] sm:text-4xl lg:text-5xl">
                Turn transparency into a competitive advantage.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#C8C4BA] sm:text-base">
                A complete Proofly profile gives customers useful evidence before
                they decide to contact, hire, or buy from you.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {BENEFITS.map(({ icon: Icon, title, desc }) => (
                <article
                  key={title}
                  className="group rounded-3xl border border-[#E7B857]/18 bg-[#101A2A] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#16C8C8]/45 hover:shadow-[0_22px_60px_rgba(0,0,0,.28)] sm:p-7"
                >
                  <div className="flex items-start gap-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#16C8C8]/25 bg-[#16C8C8]/10 text-[#16C8C8] transition group-hover:border-[#E7B857]/40 group-hover:text-[#E7B857]">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-[#F7F1E3] sm:text-lg">{title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[#C8C4BA]">{desc}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#E7B857]/15 bg-[#0B1423] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-2xl lg:mb-16">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[#E7B857]">
                Your path
              </p>
              <h2 className="display-type text-3xl font-bold leading-tight text-[#F7F1E3] sm:text-4xl lg:text-5xl">
                From unknown to confidently verified.
              </h2>
              <p className="mt-5 text-sm leading-7 text-[#C8C4BA] sm:text-base">
                Four straightforward steps give you control of your business
                information and a clearer way to engage with customers.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step) => (
                <article
                  key={step.n}
                  className="relative overflow-hidden rounded-3xl border border-[#E7B857]/18 bg-[#101A2A] p-6"
                >
                  <span className="absolute right-4 top-2 text-5xl font-black text-[#E7B857]/[.07]">
                    {step.n}
                  </span>
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-[#E7B857]/35 bg-[#E7B857]/10 text-xs font-extrabold text-[#E7B857]">
                    {step.n}
                  </div>
                  <h3 className="text-base font-bold text-[#F7F1E3]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#C8C4BA]">{step.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="wine-grid relative overflow-hidden px-5 py-20 text-center sm:px-8 lg:px-12 lg:py-24">
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[650px] -translate-x-1/2 rounded-full bg-[#E7B857]/10 blur-[100px]" />
          <div className="relative mx-auto max-w-2xl rounded-[32px] border border-[#E7B857]/25 bg-[#101A2A]/85 px-6 py-12 shadow-[0_24px_80px_rgba(0,0,0,.35)] sm:px-12">
            <ShieldCheck className="mx-auto mb-5 text-[#16C8C8]" size={34} aria-hidden="true" />
            <h2 className="display-type text-3xl font-bold leading-tight text-[#E7B857] sm:text-4xl">
              Start with a free business profile.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#D8D3C7] sm:text-base">
              Claim your presence today. Advanced verification, analytics, and
              priority dispute support remain available through paid plans.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                href="/business/claim"
                variant="gold"
                className="border-[#E7B857] bg-[#E7B857] !text-white hover:bg-[#F1C96A] hover:!text-white"
              >
                Claim Your Business
                <ArrowRight size={16} />
              </Button>
              <Button
                href="/pricing"
                variant="outline"
                className="border-[#E7B857]/45 bg-transparent !text-[#F7F1E3] hover:border-[#E7B857] hover:bg-[#E7B857]/10 hover:!text-[#F7F1E3]"
              >
                View Pricing
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
