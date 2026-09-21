"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { App } from "antd";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const { message } = App.useApp();

  async function handleSignOut() {
    setPending(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Could not sign out.");
      message.success("Signed out successfully.");
      router.push("/login");
      router.refresh();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Could not sign out.");
      setPending(false);
    }
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
