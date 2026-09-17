import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { ConsumerIllustration } from "@/components/illustrations/consumer-illustration";
import { BusinessIllustration } from "@/components/illustrations/business-illustration";

const TRUST_ITEMS = [
  { icon: "🛡️", bg: "#FCEEE0", title: "Safer People", desc: "Make informed decisions" },
  { icon: "👥", bg: "#E9F7EF", title: "Stronger Businesses", desc: "Build real credibility" },
  { icon: "🗄️", bg: "#EAF1FF", title: "Clearer Information", desc: "Evidence you can trust" },
  { icon: "🌐", bg: "#E9ECFB", title: "A More Transparent World", desc: "For everyone" },
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
      <section className="bg-gradient-to-b from-[#EEF1FB] to-[#F9FAFD] px-6 py-20 md:px-12 lg:py-28">
        <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-16 lg:flex-row lg:items-start lg:gap-20">
          <div className="max-w-[480px]">
            <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-bold text-navy-500 shadow-card-sm">
              ✨ AI-Powered Trust Platform
            </span>
            <h1 className="mb-5 text-[44px] font-extrabold leading-[1.1] text-navy-700">
              Check before
              <br />
              you <span className="text-gold-500">trust.</span>
            </h1>
            <p className="mb-8 max-w-[420px] text-[14.5px] leading-relaxed text-navy-300">
              Investigate. Verify. Connect with confidence. Proofly AI helps you
              assess potential risks, analyze evidence, and connect with trusted
              businesses and sellers — all in one place.
            </p>
            <form
              action="/search"
              className="mb-4 flex items-center gap-2 rounded-2xl border border-line bg-white p-1.5 shadow-card-sm"
            >
              <span className="pl-2.5 text-navy-300">🔍</span>
              <input
                name="q"
                placeholder="Search a name, business, phone, email, website…"
                className="flex-1 rounded-lg border-none px-2 py-2.5 text-sm outline-none"
              />
              <button className="rounded-lg bg-navy-600 px-5 py-2.5 text-sm font-semibold text-white">
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
                    className="-ml-2 h-7.5 w-7.5 rounded-full border-2 border-white bg-gradient-to-br from-[#9fb0d6] to-[#5b6ea8] first:ml-0"
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

          <div className="relative h-[380px] w-full max-w-[440px] shrink-0">
            <div className="absolute right-4 top-4 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle_at_32%_28%,_#3a5490_0%,_#1F3A73_45%,_#0F2047_100%)] shadow-2xl" />
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
      <section className="border-y border-line bg-white px-6 py-8 md:px-12">
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
      <section id="features" className="px-6 py-20 md:px-12">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="mb-2.5 text-xs font-extrabold uppercase tracking-wide text-gold-500">
            How Proofly Works
          </p>
          <h2 className="mb-2.5 text-3xl font-bold text-navy-700">
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
          <div className="rounded-[20px] bg-gradient-to-br from-navy-600 to-navy-700 p-5 text-white shadow-card">
            <div className="mb-3.5 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
              <b className="text-sm">Investigation Report</b>
              <span className="text-[10.5px] text-navy-100/70">Report #1024</span>
            </div>
            <div className="mb-3.5 flex items-center gap-3.5 rounded-xl bg-white/5 p-3.5">
              <div
                className="flex h-13 w-13 items-center justify-center rounded-full"
                style={{ background: "conic-gradient(#E5555F 0% 72%, rgba(255,255,255,.12) 72% 100%)" }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16264f] text-sm font-extrabold">
                  72
                </div>
              </div>
              <div>
                <b className="block text-[13px] text-[#FF8A8A]">High Risk</b>
                <span className="text-[10.5px] text-navy-100/70">Multiple risk signals detected</span>
              </div>
            </div>
            <div className="space-y-2 text-[10.5px] text-navy-100/85">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E5555F]" />
                Multiple negative reports
                <span className="ml-auto text-navy-100/50">Community</span>
              </div>
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E5555F]" />
                Suspicious website behavior
                <span className="ml-auto text-navy-100/50">Technical</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E5555F]" />
                Linked to other flagged sellers
                <span className="ml-auto text-navy-100/50">Network</span>
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
          <h2 className="text-3xl font-bold text-navy-700">Which one are you?</h2>
        </div>
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#E9EEFB] to-[#D7E0F5] p-8">
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
          <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#EFEAF9] to-[#E1D9F5] p-8">
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
            <Button href="/for-consumers" variant="gold">
              Get Started →
            </Button>
            <Button href="/for-businesses" variant="outline" className="border-white/40 bg-white/10 text-white">
              🏢 For Businesses
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
