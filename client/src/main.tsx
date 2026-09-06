import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "./constants/config";

// Defaults (staleTime: 0, refetchOnWindowFocus: true) treat every query as
// stale the instant it lands, so navigating back to a page — or just
// tabbing over to devtools and back — re-fetches data that hasn't changed.
// A short staleTime plus disabling the focus refetch cuts that duplicate
// traffic project-wide; individual queries can still opt into tighter
// freshness with their own staleTime where it actually matters.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </GoogleOAuthProvider>
);
