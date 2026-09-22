"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageHead } from "@/components/layout/app-shell";
import { StepIndicator } from "@/components/ui/step-indicator";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SubjectType } from "@/lib/types";
import { createInvestigation } from "../actions";

const SUBJECTS: { type: SubjectType; icon: string; label: string; desc: string }[] = [
  { type: "seller", icon: "🛍️", label: "Seller", desc: "Marketplace or social seller" },
  { type: "listing", icon: "📋", label: "Listing", desc: "A product or rental listing" },
  { type: "website", icon: "🌐", label: "Website", desc: "An unfamiliar website" },
  { type: "business", icon: "🏢", label: "Business", desc: "A company or storefront" },
  { type: "freelancer", icon: "💼", label: "Freelancer", desc: "Hiring for a service" },
  { type: "rental", icon: "🏠", label: "Rental", desc: "Property or short-term stay" },
  { type: "message", icon: "💬", label: "Message", desc: "A suspicious DM or email" },
  { type: "other", icon: "➕", label: "Other", desc: "Something else entirely" },
];

const STEPS = [
  { label: "Subject & Details" },
  { label: "Evidence" },
  { label: "AI Review" },
  { label: "Report" },
];

function NewInvestigationForm() {
  const searchParams = useSearchParams();
  const prefillSubject = searchParams.get("subject") || "";
  const [subject, setSubject] = useState<SubjectType>("seller");
  const [pending, setPending] = useState(false);

  return (
    <div>
      <PageHead
        title="Start a new investigation"
        description="What are you trying to check before you trust it?"
      />
      <StepIndicator steps={STEPS} currentIndex={0} />

      <form action={createInvestigation} onSubmit={() => setPending(true)} className="max-w-3xl">
        <input type="hidden" name="subjectType" value={subject} />
        <div className="mb-7 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          {SUBJECTS.map((s) => (
            <button
              type="button"
              key={s.type}
              onClick={() => setSubject(s.type)}
              className={cn(
                "rounded-2xl border p-4 text-center transition",
                subject === s.type
                  ? "border-gold-500 bg-[#101A2A] shadow-[0_0_0_3px_rgba(231,184,87,0.14)]"
                  : "border-line bg-white"
              )}
            >
              <div className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-lg">
                {s.icon}
              </div>
              <b className="mb-0.5 block text-[13px]">{s.label}</b>
              <span className="text-[10.5px] text-navy-300">{s.desc}</span>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-line bg-white p-6">
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-info-bg px-3.5 py-1.5 text-[12.5px] font-bold text-info">
            {SUBJECTS.find((s) => s.type === subject)?.icon}{" "}
            {SUBJECTS.find((s) => s.type === subject)?.label}
          </span>

          <Field label="Investigation Title">
            <Input
              name="title"
              defaultValue={prefillSubject ? `${prefillSubject} — investigation` : ""}
              placeholder="e.g. TechDeals Express — Instagram seller"
              required
            />
          </Field>
          <div className="grid gap-x-4.5 sm:grid-cols-2">
            <Field label="Seller / Business Name">
              <Input name="subjectName" defaultValue={prefillSubject} placeholder="e.g. TechDeals Express" />
            </Field>
            <Field label="Phone Number">
              <Input name="subjectPhone" placeholder="+961 ..." />
            </Field>
            <Field label="Email Address">
              <Input name="subjectEmail" placeholder="name@example.com" />
            </Field>
            <Field label="Website / Profile URL">
              <Input name="subjectUrl" type="url" placeholder="https://company.com or https://social.example/profile" />
            </Field>
          </div>
          <Field label="Notes (optional)" className="sm:col-span-2">
            <Textarea name="notes" placeholder="Anything else worth noting — how you found them, why you're unsure, etc." />
          </Field>

          <div className="mt-2 flex justify-end">
            <Button type="submit" variant="navy" disabled={pending}>
              {pending ? "Creating…" : "Continue to Evidence →"}
            </Button>
          </div>
          <p className="mt-4 rounded-xl border border-line bg-navy-50 p-3 text-xs leading-relaxed text-navy-300">
            Public websites worldwide are checked through a protected scanner. Proofly reviews the submitted page, connection security, evidence, and known relationships—it does not declare a company fraudulent or guarantee safety.
          </p>
        </div>
      </form>
    </div>
  );
}

export default function NewInvestigationPage() {
  return (
    <Suspense>
      <NewInvestigationForm />
    </Suspense>
  );
}
