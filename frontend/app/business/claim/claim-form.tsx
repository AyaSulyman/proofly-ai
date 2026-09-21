"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { App } from "antd";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { claimBusiness } from "./actions";

export function ClaimForm() {
  const [pending, setPending] = useState(false); const router = useRouter(); const { message } = App.useApp();
  async function submit(formData: FormData) {
    setPending(true); const result = await claimBusiness(formData); setPending(false);
    if (!result.success) { message.error(result.error); return; }
    message.success("Business claimed successfully."); router.push(`/business/${result.id}`); router.refresh();
  }
  return <form action={submit}>
    <Field label="Business Name"><Input name="name" placeholder="e.g. TechWorld Store" required /></Field>
    <Field label="Business Email"><Input name="email" type="email" placeholder="contact@yourbusiness.com" required /></Field>
    <Field label="Category"><Input name="category" placeholder="e.g. Electronics & Gadgets" required /></Field>
    <Field label="Website (optional)"><Input name="website" placeholder="https://yourbusiness.com" /></Field>
    <Field label="Phone (optional)"><Input name="phone" type="tel" placeholder="+961 …" /></Field>
    <Field label="Location (optional)"><Input name="location" placeholder="Sidon, Lebanon" /></Field>
    <Button type="submit" block disabled={pending}>{pending ? "Claiming…" : "Claim Business →"}</Button>
  </form>;
}
