"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { PageHead } from "@/components/layout/app-shell";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { disputes } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const STAGES = ["Opened", "Business Responded", "Awaiting You", "Under Review", "Resolved"];

export default function DisputeThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const dispute = disputes.find((d) => d.id === id);
  const [reply, setReply] = useState("");
  if (!dispute) return notFound();

  const currentStage = 2; // "Awaiting You"

  return (
    <div>
      <PageHead
        title={`Dispute #${dispute.id.replace("disp_", "D-")} — ${dispute.subjectName}`}
        description="Payment issue · Opened Sep 12, 2026"
        action={
          <Button href="/disputes" variant="outline" size="sm">
            ← Back to Disputes
          </Button>
        }
      />

      {/* Status bar */}
      <div className="mb-5 flex items-center rounded-2xl border border-line bg-white p-4.5">
        {STAGES.map((label, i) => (
          <div key={label} className="flex flex-1 items-center last:flex-none">
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
              <span
                className={cn(
                  "whitespace-nowrap text-[11px] font-semibold",
                  i === currentStage ? "text-navy-700" : "text-navy-300"
                )}
              >
                {label}
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
                  m.author === "reporter" ? "bg-gradient-to-br from-[#9fb0d6] to-[#5b6ea8]" : "bg-gradient-to-br from-gold-300 to-gold-500 !text-navy-700"
                )}
              >
                {m.authorName.slice(0, 2).toUpperCase()}
              </div>
              <div
                className={cn(
                  "flex-1 rounded-2xl p-3.5",
                  m.author === "reporter" ? "bg-info-bg" : "bg-[#FFFBF0]"
                )}
              >
                <div className="mb-1.5 flex justify-between">
                  <b className="text-[12.5px]">{m.authorName}</b>
                  <span className="text-[11px] text-navy-300">{m.createdAt}</span>
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

          <div className="mb-5 rounded-xl bg-info-bg px-4 py-3 text-[12.5px] text-info">
            💬 Your response is needed. Confirm whether the refund was
            received, or provide additional evidence.
          </div>

          <div className="rounded-2xl border border-line p-3.5">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write your response… Be factual and attach any supporting evidence."
              className="min-h-[80px] w-full resize-y border-none text-[13px] outline-none"
            />
            <div className="mt-2.5 flex items-center justify-between border-t border-line pt-3">
              <Button variant="outline" size="sm">📎 Attach Evidence</Button>
              <div className="flex gap-2.5">
                <Button variant="outline" size="sm">Mark as Resolved</Button>
                <Button variant="navy" size="sm" disabled={!reply.trim()}>
                  Send Response →
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div>
          <Card className="mb-5">
            <CardHeader title="Dispute Details" />
            {[
              ["Dispute ID", `#${dispute.id.replace("disp_", "D-")}`],
              ["Category", "Payment issue"],
              ["Status", "Awaiting your response"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-line py-2 text-[12.5px] last:border-none">
                <span className="text-navy-300">{k}</span>
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
