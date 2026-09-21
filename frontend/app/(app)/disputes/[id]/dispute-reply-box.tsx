"use client";

import { useState, useTransition } from "react";
import { postDisputeMessage, resolveDispute } from "../actions";
import { Button } from "@/components/ui/button";
import { App } from "antd";

export function DisputeReplyBox({ disputeId, resolved }: { disputeId: string; resolved: boolean }) {
  const [text, setText] = useState("");
  const [pending, startTransition] = useTransition();
  const { message } = App.useApp();

  if (resolved) {
    return (
      <div className="rounded-xl bg-ok-bg px-4 py-3 text-[12.5px] text-ok">
        ✓ This dispute has been resolved.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line p-3.5">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your response… Be factual and attach any supporting evidence."
        className="min-h-[80px] w-full resize-y border-none text-[13px] outline-none"
      />
      <div className="mt-2.5 flex items-center justify-between border-t border-line pt-3">
        <span className="text-[11px] text-navy-300">Attachments coming soon</span>
        <div className="flex gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() => startTransition(async () => {
              try { await resolveDispute(disputeId); message.success("Dispute marked as resolved."); }
              catch { message.error("Could not resolve this dispute."); }
            })}
          >
            Mark as Resolved
          </Button>
          <Button
            type="button"
            variant="navy"
            size="sm"
            disabled={pending || !text.trim()}
            onClick={() =>
              startTransition(async () => {
                try { await postDisputeMessage(disputeId, text.trim()); setText(""); message.success("Response sent."); }
                catch { message.error("Could not send your response."); }
              })
            }
          >
            {pending ? "Sending…" : "Send Response →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
