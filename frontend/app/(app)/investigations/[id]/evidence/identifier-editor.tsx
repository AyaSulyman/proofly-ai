"use client";

import { useState, useTransition } from "react";
import { App } from "antd";
import { Button } from "@/components/ui/button";
import { addIdentifier, removeIdentifier } from "../../actions";

export function IdentifierEditor({ investigationId, rows }: { investigationId: string; rows: { id: number; type: string; value: string }[] }) {
  const [type, setType] = useState("phone"); const [value, setValue] = useState(""); const [pending, startTransition] = useTransition(); const { message } = App.useApp();
  return <section className="mb-6 rounded-2xl border border-line bg-white p-4">
    <b className="mb-3 block text-sm">Identifiers</b>
    <div className="mb-3 flex flex-wrap gap-2">
      <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg border border-line px-3 py-2 text-sm">{["phone", "email", "domain", "username", "url", "social_handle"].map((item) => <option key={item}>{item}</option>)}</select>
      <input value={value} onChange={(e) => setValue(e.target.value)} className="min-w-52 flex-1 rounded-lg border border-line px-3 py-2 text-sm" placeholder="Identifier value" />
      <Button type="button" size="sm" disabled={pending || !value.trim()} onClick={() => startTransition(async () => { try { await addIdentifier(investigationId, type, value.trim()); setValue(""); message.success("Identifier added."); } catch { message.error("Could not add identifier."); } })}>Add</Button>
    </div>
    <div className="flex flex-wrap gap-2">{rows.map((row) => <span key={row.id} className="inline-flex items-center gap-2 rounded-full bg-navy-50 px-3 py-1.5 text-xs">{row.type}: {row.value}<button type="button" aria-label={`Remove ${row.value}`} onClick={() => startTransition(async () => { try { await removeIdentifier(investigationId, row.id); message.success("Identifier removed."); } catch { message.error("Could not remove identifier."); } })}>✕</button></span>)}</div>
  </section>;
}
