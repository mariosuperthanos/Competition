"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

// It wraps the everything(it's used on all pages) into the SessionProvider in order to
export default function AuthProvider({
  children,
  session,
}: {
  children: ReactNode;
  session?: any;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
