import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Ensure this path is correct
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login"); // updated path here too
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">
  Welcome, {session.user?.name || "there"}!
</h1>

    </div>
  );
}
