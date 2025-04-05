import "../assets/index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "@/i18n/config";

import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/globals/constants/query_client";
import { init } from "@/init/init";

// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

await init();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
        <App />
      {/* <ReactQueryDevtools/> */}
    </QueryClientProvider>
  </React.StrictMode>,
);