import { notFound } from "next/navigation";
import { PageHead } from "@/components/layout/app-shell";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch, ApiError } from "@/lib/session";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Dispute } from "@/lib/types";
import { DisputeReplyBox } from "./dispute-reply-box";

const STAGES: { key: string; label: string }[] = [
  { key: "open", label: "Opened" },
  { key: "awaiting_business", label: "Business Responded" },
  { key: "awaiting_customer", label: "Awaiting You" },
  { key: "under_review", label: "Under Review" },
  { key: "resolved", label: "Resolved" },
];

function stageIndex(status: string) {
  if (status === "resolved" || status === "dismissed") return 4;
  if (status === "under_review") return 3;
  if (status === "awaiting_customer") return 2;
  if (status === "awaiting_business") return 1;
  return 0;
}

export default async function DisputeThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let dispute: Dispute;
  try {
    dispute = await apiFetch<Dispute>(`/api/disputes/${id}/`);
  } catch (err) {
    if (err instanceof ApiError && (err.status === 404 || err.status === 403)) return notFound();
    throw err;
  }

  const currentStage = stageIndex(dispute.status);
  const resolved = dispute.status === "resolved" || dispute.status === "dismissed";

  return (
    <div>
      <PageHead
        title={`Dispute #${dispute.id.slice(0, 8)} — ${dispute.subjectName}`}
        description={`Opened ${formatDate(dispute.createdAt)}`}
        action={
          <Button href="/disputes" variant="outline" size="sm">
            ← Back to Disputes
          </Button>
        }
      />

      <div className="mb-5 flex items-center rounded-2xl border border-line bg-white p-4.5">
        {STAGES.map((stage, i) => (
          <div key={stage.key} className="flex flex-1 items-center last:flex-none">
            <div className="text-center">
              <div
                className={cn(
                  "mx-auto mb-1.5 flex h-6.5 w-6.5 items-center justify-center rounded-full text-[11px] font-extrabold",
                  i < currentStage && "bg-ok text-white",
                  i === currentStage && "bg-navy-600 text-white",
                  i > currentStage && "bg-navy-50 text-navy-300"
                )}
              >
                {i < currentStage ? "✓" : i + 1}
              </div>
              <span className={cn("whitespace-nowrap text-[11px] font-semibold", i === currentStage ? "text-navy-700" : "text-navy-300")}>
                {stage.label}
              </span>
            </div>
            {i < STAGES.length - 1 && <div className="mx-2.5 mt-[-16px] h-0.5 flex-1 bg-line" />}
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader title="Dispute Thread" />
          {dispute.messages.map((m) => (
            <div key={m.id} className="mb-4.5 flex gap-3">
              <div
                className={cn(
                  "flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white",
                  m.authorRole === "reporter" ? "bg-gradient-to-br from-[#9fb0d6] to-[#5b6ea8]" : "bg-gradient-to-br from-gold-300 to-gold-500 !text-navy-700"
                )}
              >
                {(m.authorName || "?").slice(0, 2).toUpperCase()}
              </div>
              <div className={cn("flex-1 rounded-2xl p-3.5", m.authorRole === "reporter" ? "bg-info-bg" : "bg-[#FFFBF0]")}>
                <div className="mb-1.5 flex justify-between">
                  <b className="text-[12.5px]">{m.authorName}</b>
                  <span className="text-[11px] text-navy-300">{formatDate(m.createdAt)}</span>
                </div>
                <p className="text-[13px] leading-relaxed">{m.text}</p>
                {m.attachment && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1.5 text-[11.5px]">
                    📄 {m.attachment}
                  </div>
                )}
              </div>
            </div>
          ))}
          {dispute.messages.length === 0 && (
            <p className="mb-4 text-[12.5px] text-navy-300">No messages yet.</p>
          )}

          {!resolved && dispute.status === "awaiting_customer" && (
            <div className="mb-5 rounded-xl bg-info-bg px-4 py-3 text-[12.5px] text-info">
              💬 Your response is needed. Confirm what happened, or provide additional evidence.
            </div>
          )}

          <DisputeReplyBox disputeId={dispute.id} resolved={resolved} />
        </Card>

        <div>
          <Card className="mb-5">
            <CardHeader title="Dispute Details" />
            {[
              ["Dispute ID", `#${dispute.id.slice(0, 8)}`],
              ["Status", dispute.status.replace(/_/g, " ")],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-line py-2 text-[12.5px] capitalize last:border-none">
                <span className="text-navy-300 normal-case">{k}</span>
                <span className="font-semibold">{v}</span>
              </div>
            ))}
          </Card>
          <Card>
            <CardHeader title="How this works" />
            <ul className="space-y-1.5 text-[12.5px] leading-relaxed text-navy-300">
              <li>• Both sides submit evidence</li>
              <li>• A Proofly moderator reviews the thread</li>
              <li>• The outcome is recorded on the public profile</li>
              <li>• Neither side sees the other&apos;s contact details</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
