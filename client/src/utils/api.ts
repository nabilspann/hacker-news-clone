import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client";
import { type inferRouterOutputs } from "@trpc/server";

import type { Routes } from "../../../server/trpc/routes";
import { fetcher } from "./fetcher";
import { DEV } from "solid-js";

const getBaseUrl = () => {
  return DEV
    ? `http://localhost:8080`
    : "https://nabil-hacker-news-clone.netlify.app"
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
