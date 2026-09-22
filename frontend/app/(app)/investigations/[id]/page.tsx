import { notFound } from "next/navigation";
import { PageHead } from "@/components/layout/app-shell";
import { RiskRing } from "@/components/ui/risk-ring";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch, ApiError } from "@/lib/session";
import { formatDate } from "@/lib/utils";
import type { Investigation, RiskLevel } from "@/lib/types";

const SEVERITY_DOT: Record<RiskLevel, string> = {
  high: "bg-danger",
  medium: "bg-warn",
  low: "bg-ok",
};

export default async function InvestigationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let inv: Investigation;
  try {
    inv = await apiFetch<Investigation>(`/api/investigations/${id}/`);
  } catch (err) {
    if (err instanceof ApiError && (err.status === 404 || err.status === 403)) return notFound();
    throw err;
  }

  const graph = await apiFetch<{ count: number }>(`/api/investigations/${id}/graph/`).catch(() => ({ count: 0 }));

  if (inv.status === "analyzing" || inv.status === "draft") {
    return (
      <div>
        <PageHead title={inv.title} description={`Created ${formatDate(inv.createdAt)}`} />
        <Card className="max-w-lg text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-navy-50 border-t-gold-500" />
          <b className="mb-1.5 block text-base">
            {inv.status === "draft" ? "This investigation is still a draft." : "Still analyzing…"}
          </b>
          <p className="mb-5 text-[13px] text-navy-300">
            {inv.status === "draft"
              ? "Finish adding details and evidence to generate a trust report."
              : "We'll notify you the moment your trust report is ready."}
          </p>
          <Button href={`/investigations/${id}/evidence`} variant="navy" block>
            {inv.status === "draft" ? "Resume Investigation →" : "Back to Investigations"}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHead
        title={inv.title}
        description={`Report #${inv.id.slice(0, 8)} · Generated ${formatDate(inv.createdAt)}${inv.analysisProvider ? ` · AI: ${inv.analysisProvider}` : ""}`}
      />

      {inv.needsReanalysis && (
        <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-gold-500/40 bg-gold-500/10 px-4 py-3 text-[12.5px] text-gold-300">
          ✦ Evidence or identifiers changed after the last analysis. Run the analysis again to refresh this score.
        </div>
      )}

      <Card className="mb-5 flex flex-wrap items-center gap-5">
        {inv.riskScore !== null && inv.riskLevel && (
          <RiskRing score={inv.riskScore} level={inv.riskLevel} />
        )}
        <div className="min-w-[200px] flex-1">
          <b className="mb-1 block text-base">
            {inv.riskLevel === "high"
              ? "Multiple high-severity risk signals detected."
              : inv.riskLevel === "medium"
              ? "A few risk signals worth reviewing."
              : "No significant risk signals detected."}
          </b>
          <span className="text-[12.5px] text-navy-300">{inv.summary}</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button href={`/api/investigations/${inv.id}/pdf`} variant="outline" size="sm">📄 Download PDF</Button>
        <Button
  href={`/investigations/${inv.id}/evidence`}
  variant="gold"
  size="sm"
  className="!text-white hover:!text-white"
>
  ＋ Update evidence
</Button>
          <Button href={`/reports/new?investigationId=${inv.id}`} variant="outline" size="sm">📝 Submit Report</Button>
        </div>
      </Card>

      <div className="mb-5 flex gap-2.5 rounded-xl bg-warn-bg px-4 py-3 text-[12px] leading-relaxed text-[#F4D58A]">
        ⚠️ Proofly identifies risk signals based on evidence and patterns — it
        does not declare fraud. Use this report as one input into your own
        decision, and never send payment through channels you can&apos;t reverse.
      </div>

      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <div>
          <Card className="mb-5">
            <CardHeader title={`Key Risk Signals (${inv.riskSignals.length})`} />
            {inv.riskSignals.map((s, i) => (
              <div
                key={s.id}
                className={`flex items-center gap-2.5 py-2.5 text-[12.5px] ${
                  i < inv.riskSignals.length - 1 ? "border-b border-line" : ""
                }`}
              >
                <span className={`h-2 w-2 shrink-0 rounded-full ${SEVERITY_DOT[s.severity]}`} />
                {s.label}
                <span className="ml-auto rounded-full bg-navy-50 px-2.5 py-1 text-[10.5px] text-navy-300">
                  {s.category}
                </span>
              </div>
            ))}
            {inv.riskSignals.length === 0 && (
              <p className="text-[12.5px] text-navy-300">No risk signals recorded.</p>
            )}
          </Card>

          <Card>
            <CardHeader title={`Evidence Summary (${inv.evidence.length})`} />
            {inv.evidence.map((e, i) => (
              <div
                key={e.id}
                className={`flex items-center gap-2.5 py-2 text-[12.5px] ${
                  i < inv.evidence.length - 1 ? "border-b border-line" : ""
                }`}
              >
                <span className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-navy-50">
                  {e.type === "screenshot" || e.type === "image" ? "📸" : e.type === "url" ? "🔗" : "📄"}
                </span>
                {e.fileName}
              </div>
            ))}
            {inv.evidence.length === 0 && (
              <p className="text-[12.5px] text-navy-300">No evidence recorded.</p>
            )}
          </Card>

          {(inv.analysisHistory?.length ?? 0) > 0 && (
            <Card className="mt-5">
              <CardHeader title="Score history" />
              <div className="space-y-2">
                {(inv.analysisHistory ?? []).map((item, index) => {
                  const older = inv.analysisHistory?.[index + 1];
                  const change = older ? item.riskScore - older.riskScore : 0;
                  return (
                    <div key={item.version} className="flex items-center gap-3 rounded-xl border border-line bg-navy-50 p-3 text-xs">
                      <span className="font-bold text-gold-300">v{item.version}</span>
                      <span className="font-semibold">{item.riskScore}/100 · {item.riskLevel}</span>
                      <span className="rounded-full border border-line px-2 py-1 text-[10px] text-navy-300">{item.provider}</span>
                      {older && <span className={change > 0 ? "text-danger" : change < 0 ? "text-ok" : "text-navy-300"}>{change > 0 ? "+" : ""}{change}</span>}
                      <span className="ml-auto text-navy-300">{formatDate(item.createdAt)}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>

        <div>
          <Card className="mb-5">
            <CardHeader title="Related Evidence" />
            <div className="flex items-center gap-3 rounded-xl bg-navy-50 p-3.5">
              <div className="text-xl">🔗</div>
              <div>
                <b className="block text-[13px]">
                  {graph.count > 0 ? `${graph.count} related investigation(s) found` : "No connections found"}
                </b>
                <span className="text-[11.5px] text-navy-300">
                  {graph.count > 0 ? "Shared identifiers with other investigations" : "No shared identifiers detected yet"}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="What you can do" />
            <ul className="space-y-1.5 text-[12.5px] leading-relaxed text-navy-300">
              <li>• Avoid off-platform payment requests</li>
              <li>• Ask for video verification of the item</li>
              <li>• Report this seller to help others</li>
              <li>• Save this report for your records</li>
            </ul>
          </Card>

          {inv.websiteSnapshot?.domain && (
            <Card className="mt-5">
              <CardHeader title="Website check" />
              <div className="space-y-2 text-[12.5px] text-navy-300">
                <p><b className="text-navy-700">Domain:</b> {inv.websiteSnapshot.domain}</p>
                <p><b className="text-navy-700">Connection:</b> {inv.websiteSnapshot.https && inv.websiteSnapshot.tlsValid ? "Secure HTTPS" : "Security concern detected"}</p>
                <p><b className="text-navy-700">Response:</b> HTTP {inv.websiteSnapshot.statusCode}</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
