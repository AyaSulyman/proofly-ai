import { PageHead } from "@/components/layout/app-shell";
import { Avatar } from "@/components/ui/avatar";
import { RiskBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/session";
import { formatDate } from "@/lib/utils";
import type { InvestigationStatus, RiskLevel, SubjectType } from "@/lib/types";

const STATUS_STYLE: Record<InvestigationStatus, string> = {
  draft: "bg-navy-50 text-navy-300",
  analyzing: "bg-info-bg text-info",
  completed: "bg-ok-bg text-ok",
};
const STATUS_LABEL: Record<InvestigationStatus, string> = {
  draft: "Draft",
  analyzing: "Analyzing",
  completed: "Completed",
};
const SUBJECT_ICON: Record<SubjectType, string> = {
  seller: "🛍️",
  listing: "📋",
  website: "🌐",
  business: "🏢",
  freelancer: "💼",
  rental: "🏠",
  message: "💬",
  other: "➕",
};

interface InvestigationListItem {
  id: string;
  title: string;
  subjectType: SubjectType;
  status: InvestigationStatus;
  riskScore: number | null;
  riskLevel: RiskLevel | null;
  createdAt: string;
  imageUrl: string | null;
}

export default async function InvestigationsPage() {
  const data = await apiFetch<{ count: number; results: InvestigationListItem[] }>("/api/investigations/");
  const investigations = data.results;
  const counts = {
    all: investigations.length,
    draft: investigations.filter((i) => i.status === "draft").length,
    analyzing: investigations.filter((i) => i.status === "analyzing").length,
    completed: investigations.filter((i) => i.status === "completed").length,
  };

  return (
    <div>
      <PageHead
        title="My Investigations"
        description="Everything you've checked, in one place."
        action={
          <Button href="/investigations/new" variant="navy">
            + New Investigation
          </Button>
        }
      />

      <div className="mb-4.5 flex flex-wrap gap-2">
        {[
          `All (${counts.all})`,
          `Draft (${counts.draft})`,
          `Analyzing (${counts.analyzing})`,
          `Completed (${counts.completed})`,
        ].map((t, i) => (
          <span
            key={t}
            className={`rounded-full border px-4 py-2 text-[12.5px] font-semibold ${
              i === 0
                ? "border-navy-600 bg-navy-600 text-white"
                : "border-line bg-white text-navy-300"
            }`}
          >
            {t}
          </span>
        ))}
      </div>

      {investigations.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-sm text-navy-300">
          No investigations yet.{" "}
          <a href="/investigations/new" className="font-semibold text-navy-600">
            Start your first one →
          </a>
        </div>
      )}

      <div className="space-y-2.5">
        {investigations.map((inv) => (
          <div
            key={inv.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white p-4"
          >
            {inv.imageUrl ? (
              <Avatar src={inv.imageUrl} name={inv.title} size="sm" />
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-lg">
                {SUBJECT_ICON[inv.subjectType]}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <b className="mb-0.5 block truncate text-[13.5px]">{inv.title}</b>
              <span className="text-[11.5px] capitalize text-navy-300">
                {inv.subjectType} · Created {formatDate(inv.createdAt)}
              </span>
            </div>
            {inv.riskLevel && <RiskBadge level={inv.riskLevel} />}
            <span
              className={`rounded-full px-2.5 py-1 text-[10.5px] font-bold ${STATUS_STYLE[inv.status]}`}
            >
              {STATUS_LABEL[inv.status]}
            </span>
            <Button
              href={inv.status === "draft" ? `/investigations/${inv.id}/evidence` : `/investigations/${inv.id}`}
              variant="outline"
              size="sm"
            >
              {inv.status === "draft" ? "Resume →" : "View →"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
