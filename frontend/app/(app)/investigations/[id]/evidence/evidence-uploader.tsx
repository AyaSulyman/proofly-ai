"use client";

import { useRef, useState, useTransition } from "react";
import { addFileEvidence, addTextOrUrlEvidence, removeEvidence } from "../../actions";
import { Button } from "@/components/ui/button";

interface EvidenceRow {
  id: string;
  type: string;
  fileName: string;
  category?: string;
}

const TYPE_ICON: Record<string, string> = {
  screenshot: "📸",
  image: "🖼️",
  document: "📄",
  url: "🔗",
  text: "📝",
};

export function EvidenceUploader({
  investigationId,
  initialRows,
}: {
  investigationId: string;
  initialRows: EvidenceRow[];
}) {
  const [pending, startTransition] = useTransition();
  const [panel, setPanel] = useState<"url" | "text" | null>(null);
  const [value, setValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFileType, setPendingFileType] = useState<string>("screenshot");

  function triggerFile(type: string) {
    setPendingFileType(type);
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    startTransition(() => addFileEvidence(investigationId, pendingFileType, file));
    e.target.value = "";
  }

  function submitPanel() {
    if (!value.trim() || !panel) return;
    startTransition(() => addTextOrUrlEvidence(investigationId, panel, value.trim()));
    setValue("");
    setPanel(null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf,.doc,.docx" />
        <div
          onClick={() => triggerFile("screenshot")}
          className="mb-4 cursor-pointer rounded-2xl border-2 border-dashed border-line bg-[#FAFBFE] p-9 text-center"
        >
          <div className="mb-2.5 text-3xl">📤</div>
          <b className="mb-1 block text-[13.5px]">Click to upload a file</b>
          <span className="text-xs text-navy-300">PNG, JPG, PDF, DOCX up to 20MB</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <button type="button" onClick={() => triggerFile("screenshot")} className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 py-3 text-[12.5px] font-semibold">
            📸 Add Screenshot
          </button>
          <button type="button" onClick={() => triggerFile("image")} className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 py-3 text-[12.5px] font-semibold">
            🖼️ Add Image
          </button>
          <button type="button" onClick={() => triggerFile("document")} className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 py-3 text-[12.5px] font-semibold">
            📄 Add Document
          </button>
          <button type="button" onClick={() => setPanel("url")} className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 py-3 text-[12.5px] font-semibold">
            🔗 Add URL
          </button>
          <button type="button" onClick={() => setPanel("text")} className="col-span-2 flex items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 py-3 text-[12.5px] font-semibold">
            📝 Add Text Note
          </button>
        </div>

        {panel && (
          <div className="mt-3 rounded-xl border border-gold-500 bg-[#FFFBF0] p-3.5">
            {panel === "url" ? (
              <input
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="https://instagram.com/seller-handle"
                className="mb-2.5 w-full rounded-lg border border-line px-3 py-2 text-[13px] outline-none"
              />
            ) : (
              <textarea
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="What did they say? Paste the exact message if you can."
                className="mb-2.5 min-h-[70px] w-full rounded-lg border border-line px-3 py-2 text-[13px] outline-none"
              />
            )}
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="navy" onClick={submitPanel} disabled={pending}>
                Add
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => { setPanel(null); setValue(""); }}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="mb-3 flex justify-between text-[13px] font-bold">
          <span>Evidence Added ({initialRows.length})</span>
        </div>
        {initialRows.map((row) => (
          <div key={row.id} className="mb-2.5 flex items-center gap-3 rounded-xl border border-line p-3.5">
            <div className="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-base">
              {TYPE_ICON[row.type] || "📄"}
            </div>
            <div className="min-w-0 flex-1">
              <b className="block truncate text-[12.5px]">{row.fileName}</b>
              <span className="rounded-full bg-navy-50 px-2 py-0.5 text-[10px] text-navy-300">{row.type}</span>
            </div>
            <button
              type="button"
              onClick={() => startTransition(() => removeEvidence(investigationId, row.id))}
              className="text-navy-300 hover:text-danger"
              aria-label={`Remove ${row.fileName}`}
            >
              ✕
            </button>
          </div>
        ))}
        {initialRows.length === 0 && <p className="text-[12.5px] text-navy-300">No evidence added yet.</p>}
      </div>
    </div>
  );
}
