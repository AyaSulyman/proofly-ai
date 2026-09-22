"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHead } from "@/components/layout/app-shell";
import { Field, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { submitReport } from "../actions";
import { App } from "antd";

const CATEGORIES = [
  { value: "non_delivery", icon: "📦", label: "Non-delivery" },
  { value: "payment_issue", icon: "💳", label: "Payment issue" },
  { value: "counterfeit", icon: "🏷️", label: "Counterfeit item" },
  { value: "identity_concern", icon: "🎭", label: "Identity concern" },
  { value: "suspicious_website", icon: "🌐", label: "Suspicious website" },
  { value: "other", icon: "➕", label: "Other" },
];

interface InvestigationOption {
  id: string;
  title: string;
  riskLevel: string | null;
  riskScore: number | null;
}

function NewReportForm() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("investigationId") || "";
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [investigationId, setInvestigationId] = useState(preselected);
  const [investigations, setInvestigations] = useState<InvestigationOption[]>([]);
  const [pending, setPending] = useState(false);
  const router = useRouter(); const { message } = App.useApp();

  async function handleSubmit(formData: FormData) {
    setPending(true); const result = await submitReport(formData); setPending(false);
    if (!result.success) { message.error(result.error); return; }
    message.success("Report submitted for review."); router.push("/reports"); router.refresh();
  }

  useEffect(() => {
    fetch("/api/investigations-list")
      .then((r) => r.json())
      .then((data) => setInvestigations(data.results || []))
      .catch(() => setInvestigations([]));
  }, []);

  const selected = investigations.find((i) => i.id === investigationId);

  return (
    <div>
      <PageHead
        title="Submit a community report"
        description="Share your experience so others can make safer decisions. All reports are reviewed by a moderator before they go public."
      />

      <form action={handleSubmit} className="max-w-2xl rounded-2xl border border-line bg-white p-6">
        <input type="hidden" name="category" value={category} />
        <Field label="Linked Investigation">
          <select
            name="investigationId"
            value={investigationId}
            onChange={(e) => setInvestigationId(e.target.value)}
            required
            className="w-full rounded-xl border border-line bg-[#0B1423] px-3.5 py-3 text-[13.5px] outline-none"
          >
            <option value="" disabled>
              Choose an investigation…
            </option>
            {investigations.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.title} {inv.riskLevel ? `— ${inv.riskLevel} risk` : ""}
              </option>
            ))}
          </select>
          {selected && (
            <p className="mt-2 text-[11.5px] text-navy-300">
              Report #{selected.id.slice(0, 8)} · {selected.riskScore ?? "—"}/100
            </p>
          )}
        </Field>

        <Field label="What happened?">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border p-3.5 text-left",
                  category === c.value
                    ? "border-gold-500 bg-[#101A2A] shadow-[0_0_0_3px_rgba(231,184,87,0.14)]"
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
            name="description"
            required
            placeholder="Be specific and factual. Include dates, amounts, and what was promised vs. what happened."
          />
        </Field>

        <div className="mb-5 flex gap-2.5 rounded-xl bg-warn-bg px-4 py-3 text-[12px] leading-relaxed text-[#F4D58A]">
          ⚠️ Submitting a knowingly false report may result in account
          suspension. Your report will be visible to the reported party, who
          has the right to respond through a dispute.
        </div>

        <div className="flex gap-3">
          <Button type="submit" variant="navy" disabled={pending || !investigationId}>
            {pending ? "Submitting…" : "Submit for Review →"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function NewReportPage() {
  return (
    <Suspense>
      <NewReportForm />
    </Suspense>
  );
}
