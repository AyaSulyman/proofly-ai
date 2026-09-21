import { notFound } from "next/navigation";
import { PageHead } from "@/components/layout/app-shell";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiFetch, ApiError } from "@/lib/session";
import { formatDate } from "@/lib/utils";
import type { CommunityReport, Dispute, ReportStatus } from "@/lib/types";

const STATUS_TONE: Record<ReportStatus, "warn" | "ok" | "danger"> = {
  pending: "warn",
  approved: "ok",
  rejected: "danger",
};
const STATUS_LABEL: Record<ReportStatus, string> = {
  pending: "Pending Review",
  approved: "Approved & Public",
  rejected: "Rejected",
};
const DECISION_COPY: Record<ReportStatus, { tone: string; text: React.ReactNode }> = {
  pending: {
    tone: "bg-warn-bg text-[#8A6A18]",
    text: <><b>Awaiting moderator review.</b> A moderator will check the evidence and decide whether this report goes public.</>,
  },
  approved: {
    tone: "bg-ok-bg text-[#136B48]",
    text: <><b>Approved.</b> Evidence supports the described issue. This report is now visible on the public trust profile and contributes to the risk score. The reported party has been notified and may open a dispute.</>,
  },
  rejected: {
    tone: "bg-danger-bg text-danger",
    text: <><b>Rejected.</b> This report did not meet Proofly&apos;s evidence standard and will not appear publicly.</>,
  },
};
const CATEGORY_LABEL: Record<string, string> = {
  non_delivery: "Non-delivery",
  payment_issue: "Payment issue",
  counterfeit: "Counterfeit item",
  identity_concern: "Identity concern",
  suspicious_website: "Suspicious website",
  other: "Other",
};

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let report: CommunityReport;
  try {
    report = await apiFetch<CommunityReport>(`/api/community/reports/${id}/`);
  } catch (err) {
    if (err instanceof ApiError && (err.status === 404 || err.status === 403)) return notFound();
    throw err;
  }

  const disputes = await apiFetch<{ results: Dispute[] }>("/api/disputes/").then((d) => d.results).catch(() => []);
  const relatedDispute = disputes.find((d) => d.reportId === id);

  const decision = DECISION_COPY[report.status];

  return (
    <div>
      <PageHead
        title={`${report.subjectName} — ${CATEGORY_LABEL[report.category] || report.category}`}
        description={`Report #${report.id.slice(0, 8)} · Submitted ${formatDate(report.createdAt)}`}
        action={<Badge tone={STATUS_TONE[report.status]}>{STATUS_LABEL[report.status]}</Badge>}
      />

      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <div>
          <Card className="mb-5">
            <CardHeader title="Moderator Decision" />
            <div className={`flex gap-2.5 rounded-xl p-3.5 text-[12.5px] leading-relaxed ${decision.tone}`}>
              {report.status === "approved" ? "✓" : report.status === "rejected" ? "✕" : "⏳"} <span>{decision.text}</span>
            </div>
          </Card>
          <Card>
            <CardHeader title="Your Report" />
            <p className="text-[13px] leading-relaxed text-navy-300">{report.description}</p>
          </Card>
        </div>

        <div>
          <Card className="mb-5">
            <CardHeader title="Report Details" />
            {[
              ["Category", CATEGORY_LABEL[report.category] || report.category],
              ["Status", STATUS_LABEL[report.status]],
              ["Submitted", formatDate(report.createdAt)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-line py-2 text-[12.5px] last:border-none">
                <span className="text-navy-300">{k}</span>
                <span className="font-semibold">{v}</span>
              </div>
            ))}
          </Card>
          {relatedDispute && (
            <Card>
              <CardHeader title="Related Dispute" />
              <p className="mb-3.5 text-[12.5px] leading-relaxed text-navy-300">
                There&apos;s a dispute thread linked to this report.
              </p>
              <Button href={`/disputes/${relatedDispute.id}`} variant="gold" block size="sm">
                Open Dispute →
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
