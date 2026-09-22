"use client";

import { useState, useTransition } from "react";
import { postReview } from "./actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { App } from "antd";

export function ReviewForm({ businessId }: { businessId: string }) {
  const [rating, setRating] = useState(5);
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const { message } = App.useApp();

  function handleSubmit(formData: FormData) {
    formData.set("rating", String(rating));
    startTransition(async () => {
      try {
        await postReview(businessId, formData);
        setDone(true);
        message.success("Review posted successfully.");
      } catch (error) {
        message.error(error instanceof Error ? error.message : "Sign in to post a review.");
      }
    });
  }

  if (done) {
    return (
      <div id="write-review" className="rounded-xl bg-ok-bg px-4 py-3 text-[13px] text-ok">
        ✓ Thanks — your review was posted.
      </div>
    );
  }

  return (
    <form id="write-review" action={handleSubmit} className="rounded-xl border border-line p-4">
      <b className="mb-2 block text-[13px]">Write a review</b>
      <div className="mb-3 flex gap-1 text-2xl text-gold-500">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => setRating(n)}
            className={n <= rating ? "" : "text-line"}
            aria-label={`${n} star`}
          >
            ★
          </button>
        ))}
      </div>
      <Textarea name="comment" placeholder="Share your experience…" className="mb-3" required />
      <Button type="submit" size="sm" variant="navy" disabled={pending}>
        {pending ? "Posting…" : "Post Review"}
      </Button>
    </form>
  );
}
