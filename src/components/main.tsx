import "../assets/index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";
import { store } from "../store/store";

import App from "./App";
import { QueryClientProvider } from "@tanstack/react-query"
import { pre_react_init, queryClient } from "@/frontend/pre_react_init";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

await pre_react_init();

// await init();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
          <App />
      </Provider>
      {/* <ReactQueryDevtools/> */}
    </QueryClientProvider>
  </React.StrictMode>,
);

// export { queryClient };