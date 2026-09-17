import { notFound } from "next/navigation";
import { PageHead } from "@/components/layout/app-shell";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { communityReports } from "@/lib/mock-data";

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = communityReports.find((r) => r.id === id);
  if (!report) return notFound();

  return (
    <div>
      <PageHead
        title={`${report.subjectName} — ${report.category}`}
        description={`Report #${report.id} · Submitted ${report.createdAt}`}
        action={<Badge tone="ok">Approved &amp; Public</Badge>}
      />

      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <div>
          <Card className="mb-5">
            <CardHeader title="Moderator Decision" />
            <div className="flex gap-2.5 rounded-xl bg-ok-bg p-3.5 text-[12.5px] leading-relaxed text-[#136B48]">
              ✓{" "}
              <span>
                <b>Approved.</b> Evidence supports the described issue. This
                report is now visible on the public trust profile and
                contributes to the risk score. The reported party has been
                notified and may open a dispute.
              </span>
            </div>
          </Card>
          <Card>
            <CardHeader title="Your Report" />
            <p className="text-[13px] leading-relaxed text-navy-300">
              {report.description}
            </p>
          </Card>
        </div>

        <div>
          <Card className="mb-5">
            <CardHeader title="Report Details" />
            {[
              ["Category", report.category],
              ["Status", "Approved"],
              ["Submitted", report.createdAt],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-line py-2 text-[12.5px] last:border-none">
                <span className="text-navy-300">{k}</span>
                <span className="font-semibold">{v}</span>
              </div>
            ))}
          </Card>
          <Card>
            <CardHeader title="Related Dispute" />
            <p className="mb-3.5 text-[12.5px] leading-relaxed text-navy-300">
              The reported business responded to this report. Your input is
              needed.
            </p>
            <Button href="/disputes/disp_410" variant="gold" block size="sm">
              Open Dispute →
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return communityReports.map((r) => ({ id: r.id }));
}
