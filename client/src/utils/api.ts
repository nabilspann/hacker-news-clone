import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client";
import { type inferRouterOutputs } from "@trpc/server";

import type { Routes } from "../../../server/trpc/routes";
import { fetcher } from "./fetcher";
import { DEV } from "solid-js";
import { prodDomain } from "./constants";

const getBaseUrl = () => {
  return DEV ? `http://localhost:8000` : `https://${prodDomain}`;
};

export const trpc = createTRPCProxyClient<Routes>({
  links: [
    loggerLink({
      enabled: () => import.meta.env.DEV,
    }),
    httpBatchLink({
      url: `${getBaseUrl()}/trpc`,
      fetch: fetcher,
    }),
  ],
});

export type RouterOutputs = inferRouterOutputs<Routes>;
