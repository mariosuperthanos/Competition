"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // Import TanStack DevTools
import { useState } from "react";

interface Props {
  children: React.ReactNode;
}

export default function QueryProvider({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Add ReactQueryDevtools here */}
      <ReactQueryDevtools initialIsOpen={true} /> {/* You can change initialIsOpen to true if you want it open by default */}
    </QueryClientProvider>
  );
}
