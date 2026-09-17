import { PageHead } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { communityReports } from "@/lib/mock-data";
import type { ReportStatus } from "@/lib/types";

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

export default function ReportsPage() {
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
      <div className="space-y-2.5">
        {communityReports.map((r) => (
          <div
            key={r.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white p-4"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-lg">
              📦
            </div>
            <div className="min-w-0 flex-1">
              <b className="mb-0.5 block text-[13.5px]">
                {r.subjectName} — {r.category}
              </b>
              <span className="text-[11.5px] text-navy-300">
                Submitted {r.createdAt} · Report #{r.id}
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
