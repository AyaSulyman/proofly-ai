import { PageHead } from "@/components/layout/app-shell";
import { apiFetch } from "@/lib/session";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const me = await apiFetch<{
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
  }>("/api/auth/me/");

  return (
    <div>
      <PageHead title="Account Settings" description="Manage your personal information and preferences." />
      <SettingsClient me={me} />
    </div>
  );
}
