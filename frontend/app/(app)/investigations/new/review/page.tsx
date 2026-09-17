"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHead } from "@/components/layout/app-shell";
import { StepIndicator } from "@/components/ui/step-indicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STEPS = [
  { label: "Subject & Details" },
  { label: "Evidence" },
  { label: "AI Review" },
  { label: "Report" },
];

const PROC_STEPS = [
  "Extracting evidence data",
  "Detecting risk signals",
  "Checking related investigations",
  "Generating trust report",
];

function ExtractCard({
  icon,
  fileName,
  fields,
  flag,
}: {
  icon: string;
  fileName: string;
  fields: { k: string; v: string; danger?: boolean }[];
  flag?: string;
}) {
  return (
    <div className="mb-4 rounded-2xl border border-line p-5">
      <div className="mb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-base">
            {icon}
          </div>
          <b className="text-[13px]">{fileName}</b>
        </div>
        <Badge tone="ok">✓ Confirmed</Badge>
      </div>
      <div className="grid gap-x-5 gap-y-2.5 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.k} className="text-[12.5px]">
            <div className="mb-0.5 text-navy-300">{f.k}</div>
            <div className={`font-semibold ${f.danger ? "text-danger" : ""}`}>
              {f.v} <span className="ml-1 text-[11px] font-bold text-info">Edit</span>
            </div>
          </div>
        ))}
      </div>
      {flag && (
        <div className="mt-3 flex gap-2 rounded-lg bg-danger-bg px-3 py-2.5 text-[12px] text-danger">
          ⚠️ {flag}
        </div>
      )}
    </div>
  );
}

export default function AIReviewPage() {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);

  function runAnalysis() {
    setProcessing(true);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setStepIdx(i);
      if (i >= PROC_STEPS.length) {
        clearInterval(interval);
        setTimeout(() => router.push("/investigations/inv_1042"), 500);
      }
    }, 550);
  }

  if (processing) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-[440px] rounded-[20px] bg-white p-9 text-center shadow-card">
          <div className="mx-auto mb-5 h-15 w-15 animate-spin rounded-full border-[5px] border-navy-50 border-t-gold-500" />
          <h2 className="mb-1.5 text-[19px] font-bold">Analyzing your investigation…</h2>
          <p className="mb-6 text-[13px] text-navy-300">
            This usually takes under a minute. Feel free to wait — we&apos;ll
            notify you either way.
          </p>
          {PROC_STEPS.map((label, i) => (
            <div
              key={label}
              className="flex items-center gap-2.5 border-b border-line py-2.5 text-left text-[13px] last:border-none"
            >
              <span
                className={`flex h-5.5 w-5.5 items-center justify-center rounded-full text-[11px] ${
                  i < stepIdx
                    ? "bg-ok text-white"
                    : i === stepIdx
                    ? "bg-gold-500 text-white"
                    : "bg-navy-50 text-navy-300"
                }`}
              >
                {i < stepIdx ? "✓" : i + 1}
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHead
        title="Review what our AI found"
        description="Confirm or correct the extracted details before we run the risk analysis."
      />
      <StepIndicator steps={STEPS} currentIndex={2} />

      <ExtractCard
        icon="📸"
        fileName="chat_screenshot_01.png"
        fields={[
          { k: "Seller Name", v: "TechDeals Express" },
          { k: "Product", v: "iPhone 16 Pro — 256GB" },
          { k: "Price Quoted", v: "$450 (market avg. ~$950)" },
          { k: "Payment Method Requested", v: "Wire transfer, outside platform", danger: true },
        ]}
        flag={`Flagged phrase: "pay now before it's gone, I have 3 other buyers" — classic urgency/pressure pattern.`}
      />
      <ExtractCard
        icon="🔗"
        fileName="instagram.com/techdeals.express"
        fields={[
          { k: "Account Age", v: "18 days" },
          { k: "Followers", v: "312 (low for claimed volume)" },
        ]}
      />

      <div className="mt-6 flex justify-between">
        <Button href="/investigations/new/evidence" variant="outline">
          ← Back
        </Button>
        <Button variant="navy" onClick={runAnalysis}>
          Confirm All &amp; Run Analysis →
        </Button>
      </div>
    </div>
  );
}
