"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });

      router.push("/login");
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-xl border border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:border-[#ef4444] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Выход..." : "Выйти"}
    </button>
  );
}
