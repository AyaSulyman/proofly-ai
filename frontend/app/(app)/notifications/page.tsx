import { PageHead } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { notifications } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/lib/types";

const ICON: Record<AppNotification["kind"], { icon: string; bg: string }> = {
  investigation: { icon: "🚩", bg: "#FDEBEE" },
  report: { icon: "✓", bg: "#E7F8EF" },
  dispute: { icon: "⚖️", bg: "#FBF2E1" },
  review: { icon: "⭐", bg: "#F3EEFC" },
  system: { icon: "🔔", bg: "#EAF1FF" },
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hrs = Math.floor(diffMs / 3600000);
  if (hrs < 1) return "just now";
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationsPage() {
  return (
    <div>
      <PageHead
        title="Notifications"
        description="Updates on your investigations, reports, and disputes."
        action={<Button variant="outline" size="sm">Mark all as read</Button>}
      />
      <div className="space-y-2.5">
        {notifications.map((n) => {
          const { icon, bg } = ICON[n.kind];
          return (
            <div
              key={n.id}
              className={cn(
                "flex gap-3.5 rounded-2xl border border-line bg-white p-4",
                !n.read && "border-l-4 border-l-gold-500 bg-[#FFFDF8]"
              )}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base"
                style={{ background: bg }}
              >
                {icon}
              </div>
              <div className="flex-1">
                <b className="mb-0.5 block text-[13px]">{n.title}</b>
                <span className="text-xs leading-relaxed text-navy-300">{n.body}</span>
              </div>
              <span className="whitespace-nowrap text-[11px] text-navy-100">
                {timeAgo(n.createdAt)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
