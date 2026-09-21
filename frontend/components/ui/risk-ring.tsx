import type { RiskLevel } from "@/lib/types";

const COLORS: Record<RiskLevel, string> = {
  low: "#1E9E6B",
  medium: "#A2672F",
  high: "#A62F42",
};
const LABELS: Record<RiskLevel, string> = {
  low: "LOW RISK",
  medium: "MEDIUM RISK",
  high: "HIGH RISK",
};

export function RiskRing({
  score,
  level,
  size = 84,
}: {
  score: number;
  level: RiskLevel;
  size?: number;
}) {
  const color = COLORS[level];
  const pct = Math.max(0, Math.min(100, score));
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${color} 0% ${pct}%, #F1E4DC ${pct}% 100%)`,
      }}
    >
      <div
        className="flex flex-col items-center justify-center rounded-full bg-white"
        style={{ width: size * 0.76, height: size * 0.76 }}
      >
        <b className="text-xl leading-none" style={{ color }}>
          {score}
        </b>
        <span className="mt-1 text-[8.5px] font-bold text-navy-300">
          {LABELS[level]}
        </span>
      </div>
    </div>
  );
}
