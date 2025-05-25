import "../assets/index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/lib/instances/query_client";
import App from "./App";

// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
        <App />
      {/* <ReactQueryDevtools/> */}
    </QueryClientProvider>
  </StrictMode>,
);