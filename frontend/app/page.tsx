import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { ConsumerIllustration } from "@/components/illustrations/consumer-illustration";
import { BusinessIllustration } from "@/components/illustrations/business-illustration";

const TRUST_ITEMS = [
  { icon: "🛡️", bg: "#F6E8E6", title: "Safer People", desc: "Make informed decisions" },
  { icon: "👥", bg: "#E9F7EF", title: "Stronger Businesses", desc: "Build real credibility" },
  { icon: "🗄️", bg: "#F8EEE0", title: "Clearer Information", desc: "Evidence you can trust" },
  { icon: "🌐", bg: "#F7E9EB", title: "A More Transparent World", desc: "For everyone" },
];

const STEPS = [
  { icon: "🔍", title: "1. Search", desc: "Look up a seller, business, or identifier." },
  { icon: "📋", title: "2. Add Evidence", desc: "Upload screenshots, links, or documents." },
  { icon: "✨", title: "3. AI Analysis", desc: "Our AI extracts key info and detects signals." },
  { icon: "🔗", title: "4. Connect Evidence", desc: "We find related reports and connections." },
  { icon: "📄", title: "5. Get Your Report", desc: "View a transparent report and take action." },
];

const FEATURES = [
  { icon: "🧠", bg: "#F3EEFC", title: "AI Evidence Analysis", desc: "Extracts key information from images, text, and documents." },
  { icon: "📊", bg: "#FDEBEE", title: "Risk Scoring", desc: "Transparent analysis with clear risk signals." },
  { icon: "🕸️", bg: "#EAF1FF", title: "Evidence Graph", desc: "Discover hidden connections between reports." },
  { icon: "📝", bg: "#E9F7EF", title: "Community Reporting", desc: "Real experiences from real people." },
  { icon: "✅", bg: "#EAF1FF", title: "Business Verification", desc: "Help legitimate businesses build credibility." },
  { icon: "⚖️", bg: "#F3EEFC", title: "Dispute Management", desc: "Fair and transparent resolution process." },
];

const CHECKLIST = [
  "AI-powered evidence analysis",
  "Transparent risk scoring",
  "Evidence relationship graph",
  "Community reports and reviews",
  "Business verification",
  "Dispute management",
  "Human moderation",
  "Privacy and data protection",
];

export default function LandingPage() {
  return (
    <>
      <SiteHeader />

      {/* Hero */}
      <section className="paper-texture relative overflow-hidden bg-gradient-to-br from-[#fffaf4] via-[#f7e9e4] to-[#ead1c2] px-6 py-16 md:px-12 lg:py-24">
        <div className="pointer-events-none absolute -right-28 -top-32 h-96 w-96 rounded-full border-[48px] border-navy-600/8" />
        <div className="relative mx-auto flex max-w-6xl flex-col-reverse items-center gap-14 lg:flex-row lg:items-center lg:gap-20">
          <div className="max-w-[480px]">
            <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-bold text-navy-500 shadow-card-sm">
              ✨ AI-Powered Trust Platform
            </span>
            <h1 className="display-type mb-5 text-[48px] font-bold leading-[1.02] text-navy-700 sm:text-[60px]">
              Check before
              <br />
              you <span className="italic text-navy-500">trust.</span>
            </h1>
            <p className="mb-8 max-w-[420px] text-[14.5px] leading-relaxed text-navy-300">
              Investigate. Verify. Connect with confidence. Proofly AI helps you
              assess potential risks, analyze evidence, and connect with trusted
              businesses and sellers — all in one place.
            </p>
            <form
              action="/search"
              className="mb-4 flex items-center gap-2 rounded-2xl border border-white bg-white p-1.5 shadow-card"
            >
              <span className="pl-2.5 text-navy-300">🔍</span>
              <input
                name="q"
                placeholder="Search a name, business, phone, email, website…"
                className="flex-1 rounded-lg border-none px-2 py-2.5 text-sm outline-none"
              />
              <button className="rounded-xl bg-navy-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-700">
                →
              </button>
            </form>
            <div className="mb-8 flex flex-wrap gap-4 text-xs text-navy-300">
              <span>📞 Phone</span>
              <span>✉️ Email</span>
              <span>🌐 Website</span>
              <span>🏢 Business</span>
              <span>👤 Username</span>
            </div>
            <div className="mb-9 flex items-center gap-2.5">
              <div className="flex">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="-ml-2 h-7.5 w-7.5 rounded-full border-2 border-white bg-gradient-to-br from-gold-300 to-navy-500 first:ml-0"
                  />
                ))}
              </div>
              <span className="text-xs text-navy-300">
                Join a safer, more transparent online world.
              </span>
            </div>

            {/* Audience entry points — replaces navbar search */}
            <div className="flex flex-wrap gap-3">
              <Button href="/for-consumers" variant="navy" size="sm">
                👤 I&apos;m a Consumer →
              </Button>
              <Button href="/for-businesses" variant="outline" size="sm">
                🏢 I&apos;m a Business →
              </Button>
            </div>
          </div>

          <div className="proofly-float relative h-[380px] w-full max-w-[440px] shrink-0">
            <div className="wine-grid absolute right-4 top-4 h-[310px] w-[310px] rounded-[42%_58%_64%_36%/44%_38%_62%_56%] bg-navy-700 shadow-[0_32px_70px_rgba(66,21,29,.28)]" />
            <div className="absolute left-0 top-2 flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-[11.5px] font-bold shadow-card">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-navy-50">✨</span>
              AI Analysis
              <span className="block font-medium text-navy-300">Extracting info…</span>
            </div>
            <div className="absolute right-2 top-28 flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-[11.5px] font-bold shadow-card">
              <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-ok-bg text-ok">✓</span>
              Verified Business
            </div>
            <div className="absolute left-0 top-[190px] flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-[11.5px] font-bold shadow-card">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-gold-300 to-gold-500 text-navy-700 text-[10px]">TW</span>
              TechWorld Store
            </div>
            <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-[11.5px] font-bold shadow-card">
              🔗 3 Related Reports Found
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-line bg-[#fffdf9] px-6 py-8 md:px-12">
        <p className="mb-5 text-center text-[11px] font-bold tracking-wide text-navy-100">
          BUILT FOR A MORE TRUSTED DIGITAL WORLD
        </p>
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-10">
          {TRUST_ITEMS.map((t) => (
            <div key={t.title} className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                style={{ background: t.bg }}
              >
                {t.icon}
              </div>
              <div>
                <b className="block text-[13.5px]">{t.title}</b>
                <span className="text-[11.5px] text-navy-300">{t.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="features" className="paper-texture px-6 py-20 md:px-12">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="mb-2.5 text-xs font-extrabold uppercase tracking-wide text-gold-500">
            How Proofly Works
          </p>
          <h2 className="display-type mb-2.5 text-4xl font-bold text-navy-700">
            From search to insights, in just a few steps.
          </h2>
          <p className="text-[14.5px] text-navy-300">
            A simple process to help you make smarter decisions.
          </p>
        </div>
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-10 sm:grid-cols-5">
          {STEPS.map((s) => (
            <div key={s.title} className="text-center">
              <div className="mx-auto mb-3.5 flex h-13 w-13 items-center justify-center rounded-full bg-navy-50 text-lg">
                {s.icon}
              </div>
              <b className="mb-1 block text-[13.5px]">{s.title}</b>
              <span className="text-[11.5px] text-navy-300">{s.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Platform / checklist */}
      <section className="px-6 pb-20 md:px-12">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="paper-texture rounded-[28px] border border-[#dfc7bb] bg-gradient-to-br from-[#fffdf9] to-[#f1ddd2] p-6 text-[#651B2B] shadow-card">
            <div className="mb-3.5 flex items-center justify-between rounded-xl border border-[#eaded5] bg-white/75 px-4 py-3">
              <b className="text-sm text-[#651B2B]">Investigation Report</b>
              <span className="text-[10.5px] font-medium text-[#7B2637]">Report #1024</span>
            </div>
            <div className="mb-3.5 flex items-center gap-3.5 rounded-xl border border-[#eaded5] bg-white/75 p-3.5">
              <div
                className="flex h-13 w-13 items-center justify-center rounded-full"
                style={{ background: "conic-gradient(#7B2637 0% 72%, #E8C7A7 72% 100%)" }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFFDF9] text-sm font-extrabold text-[#651B2B]">
                  72
                </div>
              </div>
              <div>
                <b className="block text-[13px] text-[#651B2B]">High Risk</b>
                <span className="text-[10.5px] text-[#7B2637]">Multiple risk signals detected</span>
              </div>
            </div>
            <div className="space-y-2 text-[10.5px] font-medium text-[#651B2B]">
              <div className="flex items-center gap-2 border-b border-[#dfc7bb] pb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7B2637]" />
                Multiple negative reports
                <span className="ml-auto text-[#7B2637]">Community</span>
              </div>
              <div className="flex items-center gap-2 border-b border-[#dfc7bb] pb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7B2637]" />
                Suspicious website behavior
                <span className="ml-auto text-[#7B2637]">Technical</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7B2637]" />
                Linked to other flagged sellers
                <span className="ml-auto text-[#7B2637]">Network</span>
              </div>
            </div>
          </div>
          <div>
            <p className="mb-3 text-[11.5px] font-extrabold uppercase tracking-wide text-info">
              Powered by Real Evidence
            </p>
            <h2 className="mb-3 text-[27px] font-bold leading-tight text-navy-700">
              More than a search — a complete trust platform.
            </h2>
            <p className="mb-5 text-sm leading-relaxed text-navy-300">
              Everything you need to investigate, verify, and connect, with the
              power of AI and community.
            </p>
            <div className="mb-6 grid grid-cols-2 gap-x-5 gap-y-2.5">
              {CHECKLIST.map((item) => (
                <div key={item} className="flex items-center gap-2 text-[13.5px]">
                  <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-info text-[10px] text-white">
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </div>
            <Button href="/register" variant="gold">
              Explore all features →
            </Button>
          </div>
        </div>
      </section>

      {/* For Consumers / For Businesses — dedicated entry points */}
      <section className="px-6 pb-20 md:px-12">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <p className="mb-2.5 text-xs font-extrabold uppercase tracking-wide text-gold-500">
            Two Ways to Use Proofly
          </p>
          <h2 className="display-type text-4xl font-bold text-navy-700">Which one are you?</h2>
        </div>
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-[28px] border border-line bg-gradient-to-br from-[#fffaf4] to-[#efd9cd] p-8 shadow-card-sm">
            <div className="flex items-start justify-between gap-5">
              <div className="max-w-[260px]">
                <span className="mb-2.5 inline-block text-[11px] font-extrabold uppercase tracking-wide text-navy-500">
                  For Consumers
                </span>
                <h3 className="mb-2.5 text-[20px] font-bold leading-snug text-navy-700">
                  Shop, hire, and connect with confidence.
                </h3>
                <p className="mb-5 text-[12.5px] leading-relaxed text-navy-300">
                  Search a seller before you buy, or start a full investigation
                  with your own evidence — all from one dedicated page.
                </p>
                <Button href="/for-consumers" variant="navy" size="sm">
                  Enter as a Consumer →
                </Button>
              </div>
              <ConsumerIllustration className="hidden w-[130px] shrink-0 rounded-2xl shadow-card sm:block" />
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[28px] border border-line bg-gradient-to-br from-[#f9eeea] to-[#e6c8c7] p-8 shadow-card-sm">
            <div className="flex items-start justify-between gap-5">
              <div className="max-w-[260px]">
                <span className="mb-2.5 inline-block text-[11px] font-extrabold uppercase tracking-wide text-navy-500">
                  For Businesses
                </span>
                <h3 className="mb-2.5 text-[20px] font-bold leading-snug text-navy-700">
                  Build trust. Grow your business.
                </h3>
                <p className="mb-5 text-[12.5px] leading-relaxed text-navy-300">
                  Check your current listing, claim your profile, and start the
                  verification process — all from one dedicated page.
                </p>
                <Button href="/for-businesses" variant="navy" size="sm">
                  Enter as a Business →
                </Button>
              </div>
              <BusinessIllustration className="hidden w-[130px] shrink-0 rounded-2xl shadow-card sm:block" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature row */}
      <section className="px-6 pb-20 md:px-12">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="mb-2.5 text-xs font-extrabold uppercase tracking-wide text-gold-500">
            Key Features
          </p>
          <h2 className="text-3xl font-bold text-navy-700">
            Everything you need for a safer online world.
          </h2>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {FEATURES.map((f) => (
            <div key={f.title}>
              <div
                className="mb-3 flex h-9.5 w-9.5 items-center justify-center rounded-[10px] text-base"
                style={{ background: f.bg }}
              >
                {f.icon}
              </div>
              <b className="mb-1.5 block text-[13.5px]">{f.title}</b>
              <span className="text-xs leading-relaxed text-navy-300">{f.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-600 to-navy-700 px-6 py-20 text-white md:px-12">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-4 text-[29px] font-bold leading-snug">
            A <span className="text-gold-300">safer</span>, more transparent
            <br />
            online world starts with you.
          </h2>
          <p className="mb-7 text-sm text-navy-100/85">
            Be part of the change. Investigate, verify, and connect with confidence.
          </p>
          <div className="flex flex-wrap gap-3.5">
          <Button
  href="/for-consumers"
  variant="gold"
  className="!text-white"
>
  Get Started →
</Button>
          <Button
  href="/for-businesses"
  variant="outline"
  className="border-white/40 bg-white/10 !text-white hover:bg-white/20"
>
  🏢 For Businesses
</Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
