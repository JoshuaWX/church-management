"use client";
import { useRouter } from "next/navigation";
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
      onClick={async () => {
        await fetch("/api/logout", { method: "POST" });
        const logoutTime = Date.now().toString();
        localStorage.setItem('site_logout', logoutTime);
        router.refresh();
      }}
      aria-label="Log out"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">Log out</span>
    </button>
  );
}
