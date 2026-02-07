"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      className="bg-red-600 text-white rounded px-4 py-2 shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition text-base sm:text-sm"
      onClick={async () => {
        console.log('[LogoutButton] Logging out: calling /api/logout');
        await fetch("/api/logout", { method: "POST" });
        const logoutTime = Date.now().toString();
        localStorage.setItem('site_logout', logoutTime);
        console.log('[LogoutButton] Set site_logout in localStorage:', logoutTime);
        router.refresh();
      }}
      aria-label="Log out"
    >
      Log out
    </button>
  );
}
