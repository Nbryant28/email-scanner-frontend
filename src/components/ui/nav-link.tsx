"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ReactNode } from "react"; // ⬅️ import ReactNode

export function NavLink({
  href,
  label,
}: {
  href: string;
  label: ReactNode; // ⬅️ change from string to ReactNode
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "block font-medium transition-colors",
        isActive ? "text-blue-600 font-bold" : "text-gray-800 hover:text-blue-600"
      )}
    >
      {label}
    </Link>
  );
}
