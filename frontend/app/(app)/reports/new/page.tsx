"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHead } from "@/components/layout/app-shell";
import { Field, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { icon: "📦", label: "Non-delivery" },
  { icon: "💳", label: "Payment issue" },
  { icon: "🏷️", label: "Counterfeit item" },
  { icon: "🎭", label: "Identity concern" },
  { icon: "🌐", label: "Suspicious website" },
  { icon: "➕", label: "Other" },
];

export default function NewReportPage() {
  const router = useRouter();
  const [category, setCategory] = useState("Non-delivery");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/reports");
  }

  return (
    <div>
      <PageHead
        title="Submit a community report"
        description="Share your experience so others can make safer decisions. All reports are reviewed by a moderator before they go public."
      />

      <form onSubmit={handleSubmit} className="max-w-2xl rounded-2xl border border-line bg-white p-6">
        <Field label="Linked Investigation">
          <div className="flex items-center gap-3 rounded-xl bg-navy-50 p-3.5">
            <div className="flex h-9.5 w-9.5 items-center justify-center rounded-lg bg-white text-base">
              🛍️
            </div>
            <div className="flex-1">
              <b className="block text-[13px]">TechDeals Express — Instagram seller</b>
              <span className="text-[11.5px] text-navy-300">
                Investigation #1042 · High Risk (84/100)
              </span>
            </div>
            <a className="text-xs font-bold text-info">Change</a>
          </div>
        </Field>

        <Field label="What happened?">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.label}
                onClick={() => setCategory(c.label)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border p-3.5 text-left",
                  category === c.label
                    ? "border-gold-500 bg-[#FFFBF0] shadow-[0_0_0_3px_rgba(217,164,65,0.14)]"
                    : "border-line bg-white"
                )}
              >
                <span>{c.icon}</span>
                <b className="text-[12.5px]">{c.label}</b>
              </button>
            ))}
          </div>
        </Field>

        <Field
          label="Describe what happened"
          hint="Stick to facts you can support with evidence. Avoid naming third parties who aren't involved."
        >
          <Textarea
            required
            placeholder="Be specific and factual. Include dates, amounts, and what was promised vs. what happened."
            defaultValue="Seller advertised an iPhone 16 Pro at $450, insisted on a wire transfer outside the platform, and used urgency language claiming other buyers were waiting."
          />
        </Field>

        <div className="mb-5 flex gap-2.5 rounded-xl bg-warn-bg px-4 py-3 text-[12px] leading-relaxed text-[#8A6A18]">
          ⚠️ Submitting a knowingly false report may result in account
          suspension. Your report will be visible to the reported party, who
          has the right to respond through a dispute.
        </div>

        <div className="flex gap-3">
          <Button type="submit" variant="navy">
            Submit for Review →
          </Button>
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
        </div>
      </form>
    </div>
  );
}
