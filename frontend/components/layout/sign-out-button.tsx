"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={pending}
      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-navy-100/85 hover:bg-white/10 hover:text-white"
    >
      <span>🚪</span>
      {pending ? "Signing out…" : "Sign Out"}
    </button>
  );
}
