// src/app/dashboard/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/ui/nav-link";




export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-[250px_1fr]">
      {/* Sidebar */}
      <aside className="bg-white border-r shadow-sm p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6">📬 Email Tracker</h2>
          <nav className="space-y-4">
          <NavLink href="/dashboard" label="Dashboard" />
          <NavLink href="/dashboard/inbox" label="Inbox" />
          <NavLink href="/dashboard/stats" label="Stats" />
          </nav>
        </div>
        <div>
          {/* Optional footer */}
          <p className="text-xs text-gray-400">&copy; 2025 Nicholas Bryant</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b bg-muted">
          <h1 className="text-lg font-semibold">Welcome back, Nicholas 👋</h1>
          <form action="/api/auth/signout" method="POST">
            <Button variant="outline" type="submit">Sign out</Button>
          </form>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
