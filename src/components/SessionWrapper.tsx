// src/components/SessionWrapper.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import ReactQueryProvider from "@/lib/react-query-provider";
import { ReactNode } from "react";

export default function SessionWrapper({ children }: { children: ReactNode }) {
  return <SessionProvider>
    <ReactQueryProvider>{children}</ReactQueryProvider>
    </SessionProvider>;
}
