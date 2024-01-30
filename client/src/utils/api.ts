import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client";
import { type inferRouterOutputs } from "@trpc/server";

import type { Routes } from "../../../server/trpc/routes";
import { fetcher } from "./fetcher";

const getBaseUrl = () => {
  return `http://localhost:8888`;
};

export const trpc = createTRPCProxyClient<Routes>({
  links: [
    loggerLink({
      enabled: () => import.meta.env.DEV,
    }),
    httpBatchLink({
      url: `${getBaseUrl()}/.netlify/functions/server/trpc`,
      fetch: fetcher,
    }),
  ],
});

export type RouterOutputs = inferRouterOutputs<Routes>;
