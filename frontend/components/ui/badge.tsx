import { cn } from "@/lib/utils";
import type { RiskLevel, VerificationStatus } from "@/lib/types";

export function Badge({
  children,
  className,
  tone = "neutral",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "ok" | "danger" | "warn" | "info" | "neutral";
}) {
  const tones: Record<string, string> = {
    ok: "bg-ok-bg text-ok",
    danger: "bg-danger-bg text-danger",
    warn: "bg-warn-bg text-warn",
    info: "bg-info-bg text-info",
    neutral: "bg-navy-50 text-navy-300",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  const map: Record<RiskLevel, { tone: "ok" | "warn" | "danger"; label: string }> = {
    low: { tone: "ok", label: "Low Risk" },
    medium: { tone: "warn", label: "Medium Risk" },
    high: { tone: "danger", label: "High Risk" },
  };
  const { tone, label } = map[level];
  return <Badge tone={tone}>{label}</Badge>;
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  if (status === "verified") {
    return <Badge tone="ok">✓ Verified</Badge>;
  }
  if (status === "pending" || status === "needs_info") {
    return <Badge tone="warn">Verification in progress</Badge>;
  }
  return <Badge tone="neutral">Unverified</Badge>;
}
