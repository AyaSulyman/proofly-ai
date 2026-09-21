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
          "radial-gradient(closest-side at 12% 88%, rgba(101,27,43,.14), transparent 70%), linear-gradient(180deg, #f0dfd1 0%, #f8eee7 38%, #fffdf9 78%), linear-gradient(120deg, #ead6c9 0%, #f5e8df 45%, #fbf7f1 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(500px 280px at 82% 5%, rgba(101,27,43,.48), transparent 67%), radial-gradient(420px 260px at 18% 2%, rgba(232,199,167,.72), transparent 65%), radial-gradient(900px 420px at 50% -6%, rgba(123,38,55,.20), transparent 70%)",
        }}
      />

      {/* decorative globe corner */}
      <svg viewBox="0 0 280 280" width="220" height="220" className="pointer-events-none absolute -bottom-14 -left-14">
        <defs>
          <radialGradient id="g1" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#9A4051" />
            <stop offset="60%" stopColor="#651B2B" />
            <stop offset="100%" stopColor="#42151D" />
          </radialGradient>
        </defs>
        <circle cx="140" cy="140" r="120" fill="url(#g1)" />
        <g stroke="#E8C7A7" strokeWidth="1" opacity="0.65" fill="none">
          <ellipse cx="140" cy="140" rx="118" ry="40" />
          <ellipse cx="140" cy="140" rx="118" ry="78" />
        </g>
      </svg>

      {/* decorative gold ring */}
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full opacity-80"
        style={{
          background:
            "conic-gradient(from 135deg, #E8C7A7, #BA704F, transparent 55%, transparent 80%, #E8C7A7)",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 14px), #000 calc(100% - 14px))",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 14px), #000 calc(100% - 14px))",
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

export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[440px] rounded-[28px] border border-white/80 bg-white/95 p-7 pb-7 shadow-card backdrop-blur sm:p-8">
      <div className="mb-1 flex items-center justify-center gap-2">
        <LogoMark size={26} />
        <span className="text-base font-extrabold text-navy-600">Proofly AI</span>
      </div>
      {children}
    </div>
  );
}

export function AuthCaption() {
  return (
    <div className="relative z-10 mt-5.5 text-center">
      <b className="block text-[15px] text-navy-600">Proofly AI</b>
      <span className="text-[12.5px] text-navy-300">A more transparent online world.</span>
      <div className="mx-auto mt-2 h-0.5 w-6.5 bg-gold-500" />
    </div>
  );
}

export { Link };
