// src/components/ConditionalChatbox.tsx
"use client";

import { usePathname } from "next/navigation";
import Chatbox from "@/components/Chatbox";

export default function ConditionalChatbox() {
  const pathname = usePathname();
  const hideChatbox = pathname.includes("/dashboard/ai") || pathname === "/login";

  if (hideChatbox) return null;
  return <Chatbox />;
}
