import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardStats from "../dashboard/_components/DashboardStats"; // 👈 Add this component

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        Welcome, {session.user?.name || "there"}!
      </h1>

      {/* 📊 Live Stats Block */}
      <DashboardStats />
    </div>
  );
}
