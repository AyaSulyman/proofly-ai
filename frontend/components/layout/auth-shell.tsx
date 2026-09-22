import Link from "next/link";
import { Logo, LogoMark } from "@/components/ui/logo";

export function AuthShell({
  children,
  topRight,
  cursive,
}: {
  children: React.ReactNode;
  topRight?: React.ReactNode;
  cursive?: string;
}) {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(closest-side at 12% 88%, rgba(88,212,210,.10), transparent 70%), linear-gradient(180deg, #0B1423 0%, #101A2A 38%, #101A2A 78%), linear-gradient(120deg, #111D2F 0%, #101A2A 45%, #070C16 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(500px 280px at 82% 5%, rgba(88,212,210,.12), transparent 67%), radial-gradient(420px 260px at 18% 2%, rgba(244,213,138,.12), transparent 65%), radial-gradient(900px 420px at 50% -6%, rgba(231,184,87,.08), transparent 70%)",
        }}
      />

      <svg
        viewBox="0 0 280 280"
        width="220"
        height="220"
        className="pointer-events-none absolute -bottom-14 -left-14"
      >
        <defs>
          <radialGradient id="g1" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#58D4D2" />
            <stop offset="60%" stopColor="#E7B857" />
            <stop offset="100%" stopColor="#F8F2E4" />
          </radialGradient>
        </defs>

        <circle cx="140" cy="140" r="120" fill="url(#g1)" />

        <g
          stroke="#F4D58A"
          strokeWidth="1"
          opacity="0.65"
          fill="none"
        >
          <ellipse cx="140" cy="140" rx="118" ry="40" />
          <ellipse cx="140" cy="140" rx="118" ry="78" />
        </g>
      </svg>

      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full opacity-80"
        style={{
          background:
            "conic-gradient(from 135deg, #F4D58A, #E7B857, transparent 55%, transparent 80%, #F4D58A)",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 14px), #000 calc(100% - 14px))",
          mask:
            "radial-gradient(farthest-side, transparent calc(100% - 14px), #000 calc(100% - 14px))",
        }}
      />

      {cursive && (
        <div className="pointer-events-none absolute right-[8%] top-[38%] text-right text-2xl font-bold italic text-navy-600">
          {cursive.split("\n").map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      )}

      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <Logo dark />
        {topRight}
      </header>

      <div className="relative z-10 flex min-h-[calc(100vh-90px)] items-center justify-center px-5 pb-10">
        {children}
      </div>
    </div>
  );
}

export function AuthCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full max-w-[440px] overflow-hidden rounded-[28px] border border-gold-500/30 bg-[#101A2A]/95 p-7 pb-7 shadow-[0_28px_80px_rgba(0,0,0,.48)] backdrop-blur-xl sm:p-8">
      <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent" />

      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-info/5 blur-3xl" />

      <div className="mb-1 flex items-center justify-center gap-2">
        <LogoMark size={26} />

        <span className="text-base font-extrabold text-gold-300">
          Proofly AI
        </span>
      </div>

      <div className="relative">{children}</div>
    </div>
  );
}

export function AuthCaption() {
  return (
    <div className="relative z-10 mt-5.5 text-center">
      <b className="block text-[15px] text-navy-600">
        Proofly AI
      </b>

      <span className="text-[12.5px] text-navy-300">
        A more transparent online world.
      </span>

      <div className="mx-auto mt-2 h-0.5 w-6.5 bg-gold-500" />
    </div>
  );
}

export { Link };