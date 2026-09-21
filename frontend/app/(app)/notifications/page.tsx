import { PageHead } from "@/components/layout/app-shell";
import { apiFetch } from "@/lib/session";
import type { AppNotification } from "@/lib/types";
import { MarkAllReadButton } from "./mark-all-button";
import { NotificationList } from "./notification-list";

export default async function NotificationsPage() {
  const data = await apiFetch<{ results: AppNotification[] }>("/api/notifications/");
  const notifications = data.results;

  return (
    <div>
      <PageHead
        title="Notifications"
        description="Updates on your investigations, reports, and disputes."
        action={<MarkAllReadButton />}
      />
      {notifications.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-sm text-navy-300">
          You&apos;re all caught up.
        </div>
      )}
      <NotificationList notifications={notifications} />
    </div>
  );
}
