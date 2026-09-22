import { PageHead } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/session";
import { formatDate } from "@/lib/utils";
import type { Dispute, DisputeStatus } from "@/lib/types";

const STATUS_LABEL: Record<DisputeStatus, string> = {
  open: "Open",
  awaiting_business: "Awaiting Business",
  awaiting_customer: "Awaiting You",
  under_review: "Under Review",
  resolved: "Resolved",
  dismissed: "Dismissed",
};
const STATUS_TONE: Record<DisputeStatus, "info" | "warn" | "ok" | "neutral"> = {
  open: "info",
  awaiting_business: "neutral",
  awaiting_customer: "info",
  under_review: "warn",
  resolved: "ok",
  dismissed: "neutral",
};

export default async function DisputesPage() {
  const data = await apiFetch<{ results: Dispute[] }>("/api/disputes/");
  const disputes = data.results;

  return (
    <div>
      <PageHead
        title="My Disputes"
        description="Reports where the other party has responded. Both sides submit evidence; a moderator decides."
      />
      {disputes.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-sm text-navy-300">
          No disputes yet.
        </div>
      )}
      <div className="space-y-2.5">
        {disputes.map((d) => {
          const needsYou = d.status === "awaiting_customer";
          return (
            <div
              key={d.id}
              className={`flex flex-wrap items-center gap-4 rounded-2xl border-y border-r border-line bg-white p-4 ${
                needsYou ? "border-l-4 border-l-gold-500" : "border-l border-l-line"
              }`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-lg">
                ⚖️
              </div>
              <div className="min-w-0 flex-1">
                <b className="mb-0.5 block text-[13.5px]">{d.subjectName}</b>
                <span className="text-[11.5px] text-navy-300">
                  Dispute #{d.id.slice(0, 8)} · Opened {formatDate(d.createdAt)}
                </span>
              </div>
              <Badge tone={STATUS_TONE[d.status]}>{STATUS_LABEL[d.status]}</Badge>
              <Button href={`/disputes/${d.id}`} variant={needsYou ? "gold" : "outline"} size="sm">
                {needsYou ? "Respond →" : "View →"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
