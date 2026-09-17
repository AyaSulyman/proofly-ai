"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHead } from "@/components/layout/app-shell";
import { StepIndicator } from "@/components/ui/step-indicator";
import { Button } from "@/components/ui/button";

const STEPS = [
  { label: "Subject & Details" },
  { label: "Evidence" },
  { label: "AI Review" },
  { label: "Report" },
];

interface EvidenceRow {
  id: string;
  icon: string;
  name: string;
  tag: string;
}

const EVIDENCE_TYPES = [
  { icon: "📸", label: "Add Screenshot" },
  { icon: "🖼️", label: "Add Image" },
  { icon: "📄", label: "Add Document" },
  { icon: "🔗", label: "Add URL" },
];

export default function EvidenceUploadPage() {
  const router = useRouter();
  const [rows, setRows] = useState<EvidenceRow[]>([
    { id: "1", icon: "📸", name: "chat_screenshot_01.png", tag: "Screenshot" },
    { id: "2", icon: "📸", name: "payment_request.png", tag: "Screenshot" },
    { id: "3", icon: "🔗", name: "instagram.com/techdeals.express", tag: "URL" },
  ]);

  function addRow(icon: string, tag: string) {
    setRows((r) => [
      ...r,
      { id: crypto.randomUUID(), icon, name: `${tag.toLowerCase()}_${r.length + 1}`, tag },
    ]);
  }

  function removeRow(id: string) {
    setRows((r) => r.filter((row) => row.id !== id));
  }

  return (
    <div>
      <PageHead
        title="Add your evidence"
        description="Screenshots, chats, listings, documents — anything that helps Proofly understand the situation."
      />
      <StepIndicator steps={STEPS} currentIndex={1} />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <div className="mb-4 rounded-2xl border-2 border-dashed border-line bg-[#FAFBFE] p-9 text-center">
            <div className="mb-2.5 text-3xl">📤</div>
            <b className="mb-1 block text-[13.5px]">Drag &amp; drop files here</b>
            <span className="text-xs text-navy-300">
              or click to browse — PNG, JPG, PDF, DOCX up to 20MB
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {EVIDENCE_TYPES.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => addRow(t.icon, t.label.replace("Add ", ""))}
                className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 py-3 text-[12.5px] font-semibold"
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => addRow("📝", "Text Note")}
              className="col-span-2 flex items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 py-3 text-[12.5px] font-semibold"
            >
              📝 Add Text Note
            </button>
          </div>
        </div>

        <div>
          <div className="mb-3 flex justify-between text-[13px] font-bold">
            <span>Evidence Added ({rows.length})</span>
          </div>
          {rows.map((row) => (
            <div
              key={row.id}
              className="mb-2.5 flex items-center gap-3 rounded-xl border border-line p-3.5"
            >
              <div className="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-base">
                {row.icon}
              </div>
              <div className="min-w-0 flex-1">
                <b className="block truncate text-[12.5px]">{row.name}</b>
                <span className="rounded-full bg-navy-50 px-2 py-0.5 text-[10px] text-navy-300">
                  {row.tag}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeRow(row.id)}
                className="text-navy-300 hover:text-danger"
                aria-label={`Remove ${row.name}`}
              >
                ✕
              </button>
            </div>
          ))}
          {rows.length === 0 && (
            <p className="text-[12.5px] text-navy-300">No evidence added yet.</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex max-w-4xl justify-between">
        <Button href="/investigations/new" variant="outline">
          ← Back
        </Button>
        <Button
          variant="navy"
          disabled={rows.length === 0}
          onClick={() => router.push("/investigations/new/review")}
        >
          Continue to AI Review →
        </Button>
      </div>
    </div>
  );
}
