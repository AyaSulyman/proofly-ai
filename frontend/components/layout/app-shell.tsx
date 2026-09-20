"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/ui/logo";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { SignOutButton } from "./sign-out-button";

const NAV_ITEMS = [
  { href: "/investigations", label: "Investigations", icon: "🔎" },
  { href: "/reports", label: "Reports", icon: "📄" },
  { href: "/disputes", label: "Disputes", icon: "⚖️" },
  { href: "/notifications", label: "Notifications", icon: "🔔" },
  { href: "/settings", label: "Profile", icon: "👤" },
];

export interface AppShellUser {
  fullName: string;
  imageUrl: string | null;
}

export function AppShell({
  children,
  user,
  unreadCount = 0,
}: {
  children: React.ReactNode;
  user: AppShellUser;
  unreadCount?: number;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-[220px] shrink-0 flex-col bg-navy-700 p-3.5 text-white">
        <div className="flex items-center gap-2.5 px-1.5 pb-4.5 pt-1">
          <LogoMark size={32} />
          <b className="text-sm">Proofly AI</b>
        </div>
        <nav className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium",
                  active
                    ? "bg-gradient-to-r from-gold-500 to-gold-300 font-bold text-navy-700"
                    : "text-navy-100/85 hover:bg-white/10 hover:text-white"
                )}
              >
                <span>{item.icon}</span>
                {item.label}
                {item.href === "/notifications" && unreadCount > 0 && (
                  <span className="ml-auto flex h-4.5 w-4.5 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="flex-1" />
        <SignOutButton />
        <div className="mt-2 rounded-xl bg-white/5 p-3 text-[11px] text-navy-100/80">
          🛡️ Safer decisions start here.
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between border-b border-line bg-white px-8 py-4">
          <div className="flex max-w-[360px] flex-1 items-center gap-2 rounded-lg bg-navy-50 px-3.5 py-2.5 text-[13px] text-navy-300">
            🔍 Search investigations, businesses…
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-navy-50 text-sm"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-danger" />
              )}
            </Link>
            <Link href="/settings" className="flex items-center gap-2 text-[12.5px] font-semibold">
              <Avatar name={user.fullName} src={user.imageUrl} size="xs" shape="circle" />
              {user.fullName}
            </Link>
          </div>
        </div>
        <main className="mx-auto max-w-[1180px] px-8 py-7">{children}</main>
      </div>
    </div>
  );
}

export function PageHead({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3.5">
      <div>
        <h1 className="mb-1.5 text-[23px] font-bold text-navy-700">{title}</h1>
        {description && <p className="text-[13.5px] text-navy-300">{description}</p>}
      </div>
      {action}
    </div>
  );
}
