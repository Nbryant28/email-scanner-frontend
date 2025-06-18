"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Optional utility class joiner

export function NavLink({ href, label }: { href: string; label: string }) {
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
