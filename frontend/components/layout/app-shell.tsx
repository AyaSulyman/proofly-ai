"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = searchQuery.trim();

    if (pathname.startsWith("/investigations")) {
      const params = new URLSearchParams();

      if (query) {
        params.set("q", query);
      }

      params.set("status", "all");
      router.push(`/investigations?${params.toString()}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  }

  return (
    <div className="min-h-screen bg-bg lg:flex">
      <aside className="wine-grid flex shrink-0 flex-col bg-navy-700 p-3 text-white lg:sticky lg:top-0 lg:h-screen lg:w-[244px] lg:p-4">
        <div className="flex items-center gap-2.5 px-1.5 py-2 lg:pb-7">
          <LogoMark size={32} />

          <b className="display-type text-[17px] !text-[#E8C7A7]">
            Proofly AI
          </b>
        </div>

        <nav className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:gap-1.5 lg:overflow-visible">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
               className={cn(
  "flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors duration-200",
  active
    ? "border border-[#E8C7A7] !bg-[#E8C7A7] !text-[#651B2B] underline decoration-[#651B2B] decoration-2 underline-offset-4 shadow-[0_8px_24px_rgba(30,8,13,.18)]"
    : "!text-[#E8C7A7] hover:bg-white/10 hover:!text-white"
)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>

                {item.href === "/notifications" && unreadCount > 0 && (
                  <span className="ml-auto flex h-4.5 w-4.5 items-center justify-center rounded-full bg-danger text-[9px] font-bold !text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden flex-1 lg:block" />

        <div className="hidden lg:block">
          <SignOutButton />
        </div>

        <div className="mt-3 hidden rounded-2xl border border-white/10 bg-white/5 p-3.5 text-[11px] leading-relaxed !text-[#E8C7A7] lg:block">
          🛡️ Safer decisions start here.
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-line bg-[#fffdf9]/92 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8 lg:py-4">
          <form
            onSubmit={handleSearch}
            className="hidden max-w-[420px] flex-1 items-center gap-2 rounded-xl border border-line bg-white p-1.5 pl-3.5 shadow-[0_4px_16px_rgba(66,21,29,.04)] sm:flex"
          >
            <span aria-hidden="true">🔍</span>

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={
                pathname.startsWith("/investigations")
                  ? "Search your investigations…"
                  : "Search businesses and sellers…"
              }
              aria-label="Search"
              className="min-w-0 flex-1 bg-transparent px-1 text-[13px] text-navy-700 outline-none placeholder:text-navy-300"
            />

            <button
              type="submit"
              className="rounded-lg bg-navy-600 px-3.5 py-2 text-xs font-semibold !text-white hover:bg-navy-700"
            >
              Search
            </button>
          </form>

          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/notifications"
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-white text-sm hover:border-gold-500"
            >
              🔔

              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-danger" />
              )}
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-2 rounded-xl px-2 py-1 text-[12.5px] font-semibold hover:bg-navy-50"
            >
              <Avatar
                name={user.fullName}
                src={user.imageUrl}
                size="xs"
                shape="circle"
              />

              {user.fullName}
            </Link>
          </div>
        </div>

        <main className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
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
        <h1 className="display-type mb-1.5 text-[27px] font-bold text-navy-700">
          {title}
        </h1>

        {description && (
          <p className="text-[13.5px] text-navy-300">{description}</p>
        )}
      </div>

      {action}
    </div>
  );
}