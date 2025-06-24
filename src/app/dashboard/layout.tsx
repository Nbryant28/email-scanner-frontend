// src/app/dashboard/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/ui/nav-link";
import { Home, Mail, BarChart, Bot, MailCheck } from 'lucide-react';

const HomeIcon = Home;
const MailIcon = Mail;
const BarChartIcon = BarChart;
const BotIcon = Bot;
const MailCheckIcon = MailCheck;





export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-[250px_1fr]">
      {/* Sidebar */}
      <aside className="bg-white border-r shadow-sm p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6">📬 InboxIQ </h2>
          <nav className="space-y-4">
          <NavLink
  href="/dashboard"
  label={
    <span className="inline-flex items-center space-x-2">
      <span><HomeIcon className="w-4 h-4" /></span>
      <span>Dashboard</span>
    </span>
  }
/>

<NavLink
  href="/dashboard/inbox"
  label={
    <span className="inline-flex items-center space-x-2">
      <MailIcon className="w-4 h-4" />
      <span>Inbox</span>
    </span>
  }
/>

<NavLink
  href="/dashboard/stats"
  label={
    <span className="inline-flex items-center space-x-2">
      <BarChartIcon className="w-4 h-4" />
      <span>Stats</span>
    </span>
  }
/>

<NavLink
  href="/dashboard/ai"
  label={
    <span className="inline-flex items-center space-x-2 border border-red-500 rounded-md px-2 py-1 bg-red-50 text-red-700 font-semibold shadow-sm">
      <BotIcon className="w-4 h-4" />
      <span>InboxIQ</span>
      <span className="text-xs bg-red-200 text-red-800 px-1.5 py-0.5 rounded">AI</span>
    </span>
  }
/>



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
