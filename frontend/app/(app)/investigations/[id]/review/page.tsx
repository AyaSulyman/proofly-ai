"use client";

import { use, useEffect, useState } from "react";
import { App } from "antd";
import { PageHead } from "@/components/layout/app-shell";
import { StepIndicator } from "@/components/ui/step-indicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { runAiReview, analyzeInvestigation } from "../../actions";

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

interface ExtractedEvidence {
  id: string;
  type: string;
  fileName: string;
  extractedData: Record<string, unknown>;
}

export default function AIReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [evidence, setEvidence] = useState<ExtractedEvidence[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    runAiReview(id)
      .then((res) => {
        setEvidence((res.evidence as ExtractedEvidence[]) || []);
        setError(null);
      })
      .catch((reason: unknown) => {
        const text = readableError(reason);
        setError(text);
        message.error(text);
      })
      .finally(() => setLoading(false));
  }, [id, message]);

  function confirmAndAnalyze() {
    setAnalyzing(true);
    const interval = setInterval(() => {
      setStepIdx((i) => Math.min(i + 1, PROC_STEPS.length));
    }, 550);
    analyzeInvestigation(id)
      .catch((reason: unknown) => {
        const text = readableError(reason);
        setAnalyzing(false);
        setStepIdx(0);
        setError(text);
        message.error(text);
      })
      .finally(() => clearInterval(interval));
  }

  if (analyzing) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-[440px] rounded-[20px] bg-white p-9 text-center shadow-card">
          <div className="mx-auto mb-5 h-15 w-15 animate-spin rounded-full border-[5px] border-navy-50 border-t-gold-500" />
          <h2 className="mb-1.5 text-[19px] font-bold">Analyzing your investigation…</h2>
          <p className="mb-6 text-[13px] text-navy-300">
            This usually takes under a minute. Feel free to wait — we&apos;ll notify you either way.
          </p>
          {PROC_STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2.5 border-b border-line py-2.5 text-left text-[13px] last:border-none">
              <span
                className={`flex h-5.5 w-5.5 items-center justify-center rounded-full text-[11px] ${
                  i < stepIdx ? "bg-ok text-[#070C16]" : i === stepIdx ? "bg-gold-500 text-[#070C16]" : "bg-navy-50 text-navy-300"
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
        description="Confirm the extracted details before we run the risk analysis."
      />
      <StepIndicator steps={STEPS} currentIndex={2} />

      {loading && (
        <div className="rounded-2xl border border-line bg-white p-8 text-center text-[13px] text-navy-300">
          Extracting evidence…
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-2xl border border-danger/30 bg-danger-bg p-5 text-sm text-danger">
          <b className="mb-1 block">AI analysis could not be completed</b>
          <span>{error}</span>
        </div>
      )}

      {!loading && evidence.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-[13px] text-navy-300">
          No evidence to review — go back and add some first.
        </div>
      )}

      {!loading &&
        evidence.map((e) => (
          <div key={e.id} className="mb-4 rounded-2xl border border-line p-5">
            <div className="mb-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-base">
                  {e.type === "url" ? "🔗" : e.type === "text" ? "📝" : "📸"}
                </div>
                <b className="text-[13px]">{e.fileName}</b>
              </div>
              <Badge tone="ok">✓ Analyzed</Badge>
            </div>
            <div className="grid gap-x-5 gap-y-2.5 sm:grid-cols-2">
              {Object.entries(e.extractedData || {}).map(([k, v]) => (
                <div key={k} className="text-[12.5px]">
                  <div className="mb-0.5 capitalize text-navy-300">{k.replace(/([A-Z])/g, " $1")}</div>
                  <div className="font-semibold">{String(v)}</div>
                </div>
              ))}
              {Object.keys(e.extractedData || {}).length === 0 && (
                <span className="text-[12px] text-navy-300">No structured fields extracted from this item.</span>
              )}
            </div>
          </div>
        ))}

      <div className="mt-6 flex justify-between">
        <Button href={`/investigations/${id}/evidence`} variant="outline">
          ← Back
        </Button>
        <Button variant="navy" onClick={confirmAndAnalyze} disabled={loading || Boolean(error) || evidence.length === 0}>
          Confirm All &amp; Run Analysis →
        </Button>
      </div>
    </div>
  );
}

function readableError(reason: unknown): string {
  if (!(reason instanceof Error)) return "The AI provider could not complete the request.";
  try {
    const parsed = JSON.parse(reason.message) as { detail?: string };
    return parsed.detail || reason.message;
  } catch {
    return reason.message || "The AI provider could not complete the request.";
  }
}
