import {
  ArrowRight,
  Building2,
  Check,
  FileSearch,
  Fingerprint,
  Globe2,
  LockKeyhole,
  Network,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  UserRoundSearch,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";

const STEPS = [
  { icon: ScanSearch, title: "Search", desc: "Find a seller, business, website, phone, or email." },
  { icon: FileSearch, title: "Add evidence", desc: "Upload screenshots, messages, documents, and links." },
  { icon: Sparkles, title: "AI review", desc: "Extract facts and identify explainable risk signals." },
  { icon: Network, title: "Connect", desc: "Check shared identifiers and related investigations." },
];

const FEATURES = [
  { icon: FileSearch, title: "Evidence intelligence", desc: "Turn scattered evidence into a clear, structured view of the facts." },
  { icon: ShieldCheck, title: "Transparent scoring", desc: "Every risk percentage is based on visible, deterministic signal weights." },
  { icon: Network, title: "Relationship graph", desc: "Reveal shared identifiers and connections across previous investigations." },
  { icon: Globe2, title: "Public website checks", desc: "Inspect reachable websites securely without exposing internal network resources." },
  { icon: Fingerprint, title: "Business verification", desc: "Give legitimate businesses a clear route to establish credibility." },
  { icon: LockKeyhole, title: "Privacy by design", desc: "Ownership checks protect private evidence, identifiers, and reports." },
];

function SecurityVisual() {
  return (
    <div
      className="relative mx-auto h-[330px] w-full max-w-[440px] sm:h-[390px] lg:h-[440px]"
      aria-hidden="true"
    >
      <div className="absolute inset-10 rounded-full bg-info/10 blur-3xl" />
      <svg viewBox="0 0 420 430" className="relative h-full w-full drop-shadow-[0_25px_40px_rgba(0,0,0,.5)]">
        <defs>
          <linearGradient id="shieldFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#15263D" />
            <stop offset="1" stopColor="#08111F" />
          </linearGradient>
          <linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F4D58A" />
            <stop offset=".55" stopColor="#E7B857" />
            <stop offset="1" stopColor="#8F7136" />
          </linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <path d="M210 28 354 84v112c0 98-57 169-144 206C123 365 66 294 66 196V84Z" fill="url(#shieldFill)" stroke="url(#goldStroke)" strokeWidth="5" />
        <path d="M210 56 328 102v94c0 79-44 139-118 173-74-34-118-94-118-173v-94Z" fill="none" stroke="#2B394D" strokeWidth="2" />
        <path d="M210 116 277 147v52c0 47-26 82-67 102-41-20-67-55-67-102v-52Z" fill="none" stroke="#58D4D2" strokeWidth="4" filter="url(#glow)" />
        <path d="m177 208 23 23 46-55" fill="none" stroke="#F4D58A" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="210" cy="208" r="87" fill="none" stroke="#58D4D2" strokeDasharray="3 12" opacity=".4" />
      </svg>
      <div className="panel-surface absolute left-0 top-10 hidden rounded-xl px-4 py-3 shadow-card sm:block lg:top-14">
        <span className="mb-1 block text-[10px] font-bold uppercase tracking-[.18em] text-info">Live analysis</span>
        <b className="text-sm">Evidence protected</b>
      </div>
      <div className="panel-surface absolute bottom-8 right-0 hidden rounded-xl px-4 py-3 shadow-card sm:block lg:bottom-12">
        <span className="mb-1 block text-[10px] font-bold uppercase tracking-[.18em] text-gold-300">Explainable result</span>
        <b className="text-sm">Every signal is visible</b>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      <SiteHeader />

      <section className="wine-grid relative overflow-hidden border-b border-line bg-[radial-gradient(circle_at_72%_40%,rgba(88,212,210,.12),transparent_24rem),linear-gradient(135deg,#070c16_0%,#0b1423_55%,#070c16_100%)] px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-22">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px gold-line" />
        <div className="relative mx-auto grid min-h-[560px] max-w-7xl items-center gap-10 lg:grid-cols-[1.04fr_.96fr] lg:gap-16">
          <div className="max-w-[680px]">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-500/35 bg-gold-500/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[.16em] text-gold-300 sm:text-xs">
              <ShieldCheck size={15} /> AI-powered trust intelligence
            </span>
            <h1 className="display-type mb-6 text-[43px] font-bold leading-[1.04] tracking-[-.035em] text-white sm:text-[58px] lg:text-[68px] xl:text-[74px]">
              Make safer digital
              <span className="block text-gold-300">decisions with clarity.</span>
            </h1>
            <p className="mb-8 max-w-[610px] text-[15px] leading-7 text-navy-100 sm:text-base sm:leading-8">
              Investigate sellers, businesses, and public websites using real evidence, explainable AI signals, and transparent risk scoring—before you decide to trust.
            </p>
            <form action="/search" className="panel-surface mb-5 flex max-w-[620px] items-center gap-2 rounded-2xl p-2 shadow-card sm:gap-3">
              <ScanSearch className="ml-3 shrink-0 text-info" size={21} />
              <input name="q" aria-label="Search Proofly" placeholder="Search a business, website, phone, or email" className="min-w-0 flex-1 border-0 bg-transparent px-1 py-3 text-sm outline-none" />
              <button className="flex shrink-0 items-center gap-2 rounded-xl bg-gold-300 px-4 py-3 text-sm font-bold text-[#070c16] hover:bg-gold-500 sm:px-5">
                <span className="hidden sm:inline">Search</span><ArrowRight size={16} />
              </button>
            </form>
            <div className="mb-8 flex flex-wrap gap-x-5 gap-y-2.5 text-xs font-medium text-navy-100 sm:gap-x-6">
              {["Public websites", "Businesses", "Sellers", "Digital evidence"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5"><Check size={14} className="text-info" />{item}</span>
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
  href="/register"
  variant="gold"
  className="border-gold-300 bg-gold-500 !text-white hover:bg-gold-300 hover:!text-white"
>
  Start an Investigation
  <ArrowRight size={16} />
</Button>
              <Button href="/#how-it-works" variant="outline">See How It Works</Button>
            </div>
          </div>
          <SecurityVisual />
        </div>
      </section>

      <section className="border-b border-line bg-[#0a1220] px-5 py-7 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3 sm:gap-6">
          {[
            [ShieldCheck, "Explainable", "Clear signals behind every result"],
            [LockKeyhole, "Private", "Evidence protected by ownership rules"],
            [Globe2, "Worldwide", "Investigate any public, reachable website"],
          ].map(([Icon, title, desc]) => {
            const ItemIcon = Icon as typeof ShieldCheck;
            return (
              <div key={String(title)} className="flex items-center gap-3.5 rounded-xl px-2 py-2 sm:justify-start">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-info/25 bg-info/10 text-info"><ItemIcon size={21} /></div>
                <div><b className="mb-0.5 block text-sm">{String(title)}</b><span className="text-[12px] leading-5 text-navy-300">{String(desc)}</span></div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="how-it-works" className="px-5 py-18 sm:px-8 sm:py-22 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl sm:mb-12">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[.2em] text-info">A clear investigation process</p>
            <h2 className="display-type mb-4 text-[34px] font-bold leading-tight sm:text-[44px] lg:text-5xl">From uncertainty to an evidence-based report.</h2>
            <p className="max-w-xl text-[15px] leading-7 text-navy-300 sm:text-base">A focused workflow designed to make complex checks understandable and actionable.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <article key={step.title} className="panel-surface group relative min-h-[220px] rounded-2xl p-6 transition hover:-translate-y-1 hover:border-gold-500/55 lg:p-7">
                <span className="absolute right-5 top-4 text-4xl font-black text-white/5">0{index + 1}</span>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-info/25 bg-info/10 text-info"><step.icon size={23} /></div>
                <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
                <p className="text-[13.5px] leading-6 text-navy-300">{step.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-[#0a1220] px-5 py-18 sm:px-8 sm:py-22 lg:px-12 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[.92fr_1.08fr] lg:gap-16">
          <div className="panel-surface rounded-[28px] p-6 shadow-card sm:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-line pb-5">
              <div><span className="mb-1 block text-[10px] font-bold uppercase tracking-[.18em] text-info">Investigation report</span><b className="text-lg">TechWorld Store</b></div>
              <span className="rounded-full border border-gold-500/35 bg-gold-500/10 px-3 py-1 text-xs font-bold text-gold-300">Version 3</span>
            </div>
            <div className="mb-5 flex items-center gap-5 rounded-2xl border border-line bg-[#0b1423] p-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-[5px] border-gold-500 text-2xl font-black text-gold-300">72</div>
              <div><b className="mb-1 block text-xl">Elevated risk</b><p className="text-sm text-navy-300">Multiple evidence-backed signals require review.</p></div>
            </div>
            {["Payment request outside the platform", "Website security signals detected", "Linked identifiers found in prior checks"].map((item, index) => (
              <div key={item} className="flex items-center gap-3 border-b border-line py-3.5 text-sm last:border-0"><span className={index === 1 ? "h-2 w-2 rounded-full bg-info" : "h-2 w-2 rounded-full bg-gold-500"} />{item}<span className="ml-auto text-xs text-navy-300">Signal {index + 1}</span></div>
            ))}
          </div>
          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[.2em] text-gold-300">Evidence, not guesswork</p>
            <h2 className="display-type mb-5 text-[34px] font-bold leading-tight sm:text-[44px] lg:text-5xl">Understand what changed—and why the score changed.</h2>
            <p className="mb-8 max-w-2xl text-[15px] leading-7 text-navy-300 sm:text-base">Add new evidence after a report is generated and run the analysis again. Proofly preserves each version, shows the signals used, and lets the score move up or down as the evidence changes.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {["Versioned score history", "AI-assisted extraction", "Deterministic risk engine", "Secure website inspection", "Evidence relationship graph", "Human-readable summaries"].map((item) => <div key={item} className="flex items-center gap-3 text-sm"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-info/10 text-info"><Check size={14} /></span>{item}</div>)}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-5 py-18 sm:px-8 sm:py-22 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12"><p className="mb-3 text-xs font-extrabold uppercase tracking-[.2em] text-info">Built for digital trust</p><h2 className="display-type mb-4 text-[34px] font-bold leading-tight sm:text-[44px] lg:text-5xl">Protection that stays understandable.</h2><p className="text-[15px] leading-7 text-navy-300 sm:text-base">Powerful investigation tools presented with clarity, restraint, and transparency.</p></div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{FEATURES.map((feature) => <article key={feature.title} className="panel-surface min-h-[215px] rounded-2xl p-6 transition hover:-translate-y-1 hover:border-gold-500/40 lg:p-7"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-gold-500/25 bg-gold-500/10 text-gold-300"><feature.icon size={21} /></div><h3 className="mb-2 text-lg font-bold">{feature.title}</h3><p className="text-[13.5px] leading-6 text-navy-300">{feature.desc}</p></article>)}</div>
        </div>
      </section>

      <section className="px-5 pb-18 sm:px-8 sm:pb-22 lg:px-12 lg:pb-24">
        <div className="wine-grid relative mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-gold-500/30 bg-[radial-gradient(circle_at_80%_40%,rgba(88,212,210,.12),transparent_22rem),#0b1423] px-6 py-10 shadow-card sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:px-12">
          <div className="relative max-w-2xl"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-info">Start with confidence</p><h2 className="display-type mb-4 text-[32px] font-bold leading-tight sm:text-[40px]">Safer decisions begin with better evidence.</h2><p className="text-[15px] leading-7 text-navy-300">Create a free account and begin your first investigation in minutes.</p></div>
         <div className="relative mt-7 flex flex-wrap gap-3 lg:mt-0">
  <Button
    href="/for-consumers"
    variant="gold"
    className="border-gold-300 bg-gold-500 !text-white hover:bg-gold-300 hover:!text-white"
  >
    <UserRoundSearch size={17} />
    For Consumers
  </Button>

  <Button
    href="/for-businesses"
    variant="outline"
    className="border-gold-300 bg-transparent !text-white hover:bg-gold-500 hover:!text-white"
  >
    <Building2 size={17} />
    For Businesses
  </Button>
</div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
