import { AppShell } from "@/components/layout/app-shell";
import { apiFetch } from "@/lib/session";

interface MeResponse {
  fullName: string;
  imageUrl: string | null;
}

async function getUnreadCount(): Promise<number> {
  try {
    const data = await apiFetch<{ results: unknown[] }>("/api/notifications/?unread=true");
    return data.results.length;
  } catch {
    return 0;
  }
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // middleware.ts already redirects to /login when there's no session, so
  // by the time we get here a valid token is expected — but fetch defensively.
  const [user, unreadCount] = await Promise.all([
    apiFetch<MeResponse>("/api/auth/me/"),
    getUnreadCount(),
  ]);

  return (
    <AppShell user={user} unreadCount={unreadCount}>
      {children}
    </AppShell>
  );
}
