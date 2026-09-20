"use client";

import { useState, useTransition } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { updateProfile, updateNotificationPreference, changePassword, toggleTwoFactor } from "./actions";

interface Me {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  imageUrl: string | null;
  notifyInvestigationCompleted: boolean;
  notifyReportStatus: boolean;
  notifyDisputeActivity: boolean;
  notifyNewConnections: boolean;
  twoFactorEnabled: boolean;
}

function Toggle({ on, onChange, pending }: { on: boolean; onChange: () => void; pending?: boolean }) {
  return (
    <button
      type="button"
      disabled={pending}
      onClick={onChange}
      className={cn("relative h-6 w-10.5 shrink-0 rounded-full transition", on ? "bg-ok" : "bg-line")}
      aria-pressed={on}
    >
      <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all", on ? "left-5" : "left-0.5")} />
    </button>
  );
}

function ToggleRow({
  title,
  desc,
  on,
  onChange,
}: {
  title: string;
  desc: string;
  on: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-line py-3.5 last:border-none">
      <div>
        <b className="mb-0.5 block text-[13px]">{title}</b>
        <span className="text-[11.5px] text-navy-300">{desc}</span>
      </div>
      <Toggle on={on} onChange={onChange} />
    </div>
  );
}

const TABS = ["Profile", "Security", "Notifications", "Privacy", "Danger Zone"] as const;
type Tab = (typeof TABS)[number];

export function SettingsClient({ me }: { me: Me }) {
  const [tab, setTab] = useState<Tab>("Profile");
  const [prefs, setPrefs] = useState({
    notifyInvestigationCompleted: me.notifyInvestigationCompleted,
    notifyReportStatus: me.notifyReportStatus,
    notifyDisputeActivity: me.notifyDisputeActivity,
    notifyNewConnections: me.notifyNewConnections,
  });
  const [twoFactor, setTwoFactor] = useState(me.twoFactorEnabled);
  const [pending, startTransition] = useTransition();
  const [profileSaved, setProfileSaved] = useState(false);
  const [pwResult, setPwResult] = useState<{ success: boolean; error: string | null } | null>(null);

  function toggle(field: keyof typeof prefs) {
    const next = !prefs[field];
    setPrefs((p) => ({ ...p, [field]: next }));
    startTransition(() => updateNotificationPreference(field, next));
  }

  return (
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
                <Avatar name={me.fullName} src={me.imageUrl} size="lg" shape="circle" />
                <div>
                  <Button type="button" variant="outline" size="sm">
                    Upload New Photo
                  </Button>
                  <p className="mt-2 text-[11.5px] text-navy-300">JPG or PNG, max 2MB.</p>
                </div>
              </div>
              <form
                action={(fd) => {
                  startTransition(async () => {
                    await updateProfile(fd);
                    setProfileSaved(true);
                  });
                }}
              >
                <div className="grid gap-x-4.5 sm:grid-cols-2">
                  <Field label="Full Name">
                    <Input name="fullName" defaultValue={me.fullName} />
                  </Field>
                  <Field label="Email Address">
                    <Input defaultValue={me.email} type="email" disabled className="bg-navy-50 text-navy-300" />
                  </Field>
                  <Field label="Phone Number">
                    <Input name="phone" defaultValue={me.phone} />
                  </Field>
                  <Field label="Location">
                    <Input name="location" defaultValue={me.location} />
                  </Field>
                </div>
                <Field label="Account Type">
                  <Input defaultValue={me.role} disabled className="bg-navy-50 text-navy-300" />
                </Field>
                {profileSaved && <p className="mb-3 text-[12px] text-ok">✓ Saved.</p>}
                <Button type="submit" variant="navy" disabled={pending}>
                  {pending ? "Saving…" : "Save Changes"}
                </Button>
              </form>
            </Card>
            <Card>
              <CardHeader title="Notification Preferences" />
              <ToggleRow
                title="Investigation completed"
                desc="When AI analysis finishes on your investigations"
                on={prefs.notifyInvestigationCompleted}
                onChange={() => toggle("notifyInvestigationCompleted")}
              />
              <ToggleRow
                title="Report status changes"
                desc="Approval, rejection, or moderator requests"
                on={prefs.notifyReportStatus}
                onChange={() => toggle("notifyReportStatus")}
              />
              <ToggleRow
                title="Dispute activity"
                desc="New responses and resolution outcomes"
                on={prefs.notifyDisputeActivity}
                onChange={() => toggle("notifyDisputeActivity")}
              />
              <ToggleRow
                title="New connections found"
                desc="When your evidence links to other investigations"
                on={prefs.notifyNewConnections}
                onChange={() => toggle("notifyNewConnections")}
              />
            </Card>
          </>
        )}

        {tab === "Security" && (
          <>
            <Card className="mb-5">
              <CardHeader title="Change Password" />
              <form
                action={(fd) => {
                  startTransition(async () => {
                    const result = await changePassword(fd);
                    setPwResult(result);
                  });
                }}
              >
                {pwResult && (
                  <p className={cn("mb-3 text-[12px]", pwResult.success ? "text-ok" : "text-danger")}>
                    {pwResult.success ? "✓ Password updated." : pwResult.error}
                  </p>
                )}
                <Field label="Current Password">
                  <Input name="currentPassword" type="password" placeholder="••••••••" required />
                </Field>
                <div className="grid gap-x-4.5 sm:grid-cols-2">
                  <Field label="New Password">
                    <Input name="newPassword" type="password" placeholder="Enter new password" required />
                  </Field>
                  <Field label="Confirm New Password">
                    <Input name="confirmNewPassword" type="password" placeholder="Re-enter new password" required />
                  </Field>
                </div>
                <p className="mb-4 text-[11.5px] text-navy-300">Use 8+ characters with a mix of letters, numbers, and symbols.</p>
                <Button type="submit" variant="navy" disabled={pending}>
                  {pending ? "Updating…" : "Update Password"}
                </Button>
              </form>
            </Card>
            <Card className="mb-5">
              <CardHeader title="Two-Factor Authentication" />
              <ToggleRow
                title="Authenticator app (TOTP)"
                desc="Require a code from your authenticator on each sign-in"
                on={twoFactor}
                onChange={() => {
                  const next = !twoFactor;
                  setTwoFactor(next);
                  startTransition(() => toggleTwoFactor(next));
                }}
              />
            </Card>
          </>
        )}

        {(tab === "Notifications" || tab === "Privacy" || tab === "Danger Zone") && (
          <Card>
            <p className="text-[13px] text-navy-300">
              {tab} settings follow the same pattern as Profile/Security above.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
