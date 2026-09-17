"use client";

import { useState } from "react";
import { PageHead } from "@/components/layout/app-shell";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className={cn(
        "relative h-6 w-10.5 shrink-0 rounded-full transition",
        on ? "bg-ok" : "bg-line"
      )}
      aria-pressed={on}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all",
          on ? "left-5" : "left-0.5"
        )}
      />
    </button>
  );
}

function ToggleRow({ title, desc, defaultOn }: { title: string; desc: string; defaultOn?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-line py-3.5 last:border-none">
      <div>
        <b className="mb-0.5 block text-[13px]">{title}</b>
        <span className="text-[11.5px] text-navy-300">{desc}</span>
      </div>
      <Toggle defaultOn={defaultOn} />
    </div>
  );
}

const TABS = ["Profile", "Security", "Notifications", "Privacy", "Danger Zone"] as const;
type Tab = (typeof TABS)[number];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("Profile");

  return (
    <div>
      <PageHead title="Account Settings" description="Manage your personal information and preferences." />
      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <nav className="h-fit rounded-2xl border border-line bg-white p-2.5">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "mb-0.5 block w-full rounded-lg px-3.5 py-2.5 text-left text-[13px] font-semibold",
                tab === t ? "bg-navy-50 text-navy-700" : "text-navy-300"
              )}
            >
              {t}
            </button>
          ))}
        </nav>

        <div>
          {tab === "Profile" && (
            <>
              <Card className="mb-5">
                <CardHeader title="Personal Information" />
                <div className="mb-6 flex items-center gap-4.5">
                  <Avatar name={currentUser.name} src={currentUser.imageUrl} size="lg" shape="circle" />
                  <div>
                    <Button variant="outline" size="sm">Upload New Photo</Button>
                    <p className="mt-2 text-[11.5px] text-navy-300">JPG or PNG, max 2MB.</p>
                  </div>
                </div>
                <div className="grid gap-x-4.5 sm:grid-cols-2">
                  <Field label="Full Name">
                    <Input defaultValue={currentUser.name} />
                  </Field>
                  <Field label="Email Address">
                    <Input defaultValue={currentUser.email} type="email" />
                  </Field>
                  <Field label="Phone Number">
                    <Input defaultValue={currentUser.phone} />
                  </Field>
                  <Field label="Location">
                    <Input defaultValue={currentUser.location} />
                  </Field>
                </div>
                <Field label="Account Type">
                  <Input defaultValue={currentUser.role} disabled className="bg-navy-50 text-navy-300" />
                </Field>
                <Button variant="navy">Save Changes</Button>
              </Card>
              <Card>
                <CardHeader title="Notification Preferences" />
                <ToggleRow title="Investigation completed" desc="When AI analysis finishes on your investigations" defaultOn />
                <ToggleRow title="Report status changes" desc="Approval, rejection, or moderator requests" defaultOn />
                <ToggleRow title="Dispute activity" desc="New responses and resolution outcomes" defaultOn />
                <ToggleRow title="New connections found" desc="When your evidence links to other investigations" />
              </Card>
            </>
          )}

          {tab === "Security" && (
            <>
              <Card className="mb-5">
                <CardHeader title="Change Password" />
                <Field label="Current Password">
                  <Input type="password" placeholder="••••••••" />
                </Field>
                <div className="grid gap-x-4.5 sm:grid-cols-2">
                  <Field label="New Password">
                    <Input type="password" placeholder="Enter new password" />
                  </Field>
                  <Field label="Confirm New Password">
                    <Input type="password" placeholder="Re-enter new password" />
                  </Field>
                </div>
                <p className="mb-4 text-[11.5px] text-navy-300">
                  Use 8+ characters with a mix of letters, numbers, and symbols.
                </p>
                <Button variant="navy">Update Password</Button>
              </Card>
              <Card className="mb-5">
                <CardHeader title="Two-Factor Authentication" />
                <ToggleRow title="Authenticator app (TOTP)" desc="Require a code from your authenticator on each sign-in" defaultOn />
                <ToggleRow title="Email backup codes" desc="Send a one-time code to your email as a fallback" />
              </Card>
              <Card>
                <CardHeader title="Active Sessions" />
                {[
                  { device: "Chrome on macOS — Sidon, LB", meta: "IP 91.***.***.44 · This device", tag: "This device" },
                  { device: "Safari on iPhone — Beirut, LB", meta: "Last active Sep 14, 2026", tag: "Revoke" },
                ].map((s) => (
                  <div key={s.device} className="flex items-center justify-between border-b border-line py-3 text-[12.5px] last:border-none">
                    <div>
                      <b className="block">{s.device}</b>
                      <span className="text-navy-300">{s.meta}</span>
                    </div>
                    {s.tag === "This device" ? (
                      <span className="rounded-full bg-ok-bg px-2.5 py-1 text-[10.5px] font-bold text-ok">This device</span>
                    ) : (
                      <Button variant="danger-outline" size="sm">Revoke</Button>
                    )}
                  </div>
                ))}
              </Card>
            </>
          )}

          {(tab === "Notifications" || tab === "Privacy" || tab === "Danger Zone") && (
            <Card>
              <p className="text-[13px] text-navy-300">
                {tab} settings — same pattern as Profile/Security, wired to the
                Django user preferences endpoint once the backend is connected.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
