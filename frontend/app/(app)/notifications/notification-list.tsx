"use client";

import { useTransition } from "react";
import { App } from "antd";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/lib/types";
import { markRead } from "./actions";

const ICON: Record<AppNotification["kind"], { icon: string; bg: string }> = {
  investigation: { icon: "🚩", bg: "#FDEBEE" }, report: { icon: "✓", bg: "#E7F8EF" }, dispute: { icon: "⚖️", bg: "#FBF2E1" }, review: { icon: "⭐", bg: "#F3EEFC" }, system: { icon: "🔔", bg: "#EAF1FF" },
};
function timeAgo(iso: string) { const hours = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000); return hours < 1 ? "just now" : hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`; }

export function NotificationList({ notifications }: { notifications: AppNotification[] }) {
  const [pending, startTransition] = useTransition(); const { message } = App.useApp();
  return <div className="space-y-2.5">{notifications.map((item) => { const style = ICON[item.kind]; return <button type="button" disabled={pending} key={item.id} onClick={() => !item.read && startTransition(async () => { try { await markRead(item.id); message.success("Notification marked as read."); } catch { message.error("Could not update notification."); } })} className={cn("flex w-full gap-3.5 rounded-2xl border border-line bg-white p-4 text-left shadow-[0_5px_18px_rgba(66,21,29,.035)] hover:border-gold-300", !item.read && "border-l-4 border-l-gold-500 bg-[#FFF9F4]")}>
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base" style={{ background: style.bg }}>{style.icon}</span>
    <span className="flex-1"><b className="mb-0.5 block text-[13px]">{item.title}</b><span className="text-xs leading-relaxed text-navy-300">{item.body}</span></span>
    <span className="whitespace-nowrap text-[11px] text-navy-100">{timeAgo(item.createdAt)}</span>
  </button>; })}</div>;
}
