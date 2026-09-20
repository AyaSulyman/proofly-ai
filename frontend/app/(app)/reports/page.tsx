import { PageHead } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/session";
import type { CommunityReport, ReportStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const STATUS_TONE: Record<ReportStatus, "warn" | "ok" | "danger"> = {
  pending: "warn",
  approved: "ok",
  rejected: "danger",
};
const STATUS_LABEL: Record<ReportStatus, string> = {
  pending: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
};
const CATEGORY_LABEL: Record<string, string> = {
  non_delivery: "Non-delivery",
  payment_issue: "Payment issue",
  counterfeit: "Counterfeit item",
  identity_concern: "Identity concern",
  suspicious_website: "Suspicious website",
  other: "Other",
};

export default async function ReportsPage() {
  const data = await apiFetch<{ results: CommunityReport[] }>("/api/community/reports/");
  const reports = data.results;

  return (
    <div>
      <PageHead
        title="My Reports"
        description="Reports you've submitted and their moderation status."
        action={
          <Button href="/reports/new" variant="navy">
            + New Report
          </Button>
        }
      />
      {reports.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-sm text-navy-300">
          No reports submitted yet.
        </div>
      )}
      <div className="space-y-2.5">
        {reports.map((r) => (
          <div
            key={r.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white p-4"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-lg">
              📦
            </div>
            <div className="min-w-0 flex-1">
              <b className="mb-0.5 block text-[13.5px]">
                {r.subjectName} — {CATEGORY_LABEL[r.category] || r.category}
              </b>
              <span className="text-[11.5px] text-navy-300">
                Submitted {formatDate(r.createdAt)} · Report #{r.id.slice(0, 8)}
              </span>
            </div>
            <Badge tone={STATUS_TONE[r.status]}>{STATUS_LABEL[r.status]}</Badge>
            <Button href={`/reports/${r.id}`} variant="outline" size="sm">
              View →
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
