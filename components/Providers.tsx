"use client";

import { SessionProvider } from "next-auth/react";
import { Layout } from "./ui/Layout";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Layout>{children}</Layout>
    </SessionProvider>
  );
}
