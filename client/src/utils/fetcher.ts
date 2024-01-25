import { RequestInitEsque } from "@trpc/client/dist/internals/types";
import authStore from "./createAuthStore";

export const fetcher = async (
  info: RequestInfo | URL,
  options: RequestInit | RequestInitEsque | undefined
) => {
  const response = await fetch(info, { ...options, credentials: "include" });
  if (response.status === 401) {
    const {
      refreshTokenState,
    } = authStore;

    try {
      await refreshTokenState();

      return await fetch(info, {
        ...options,
        credentials: "include",
        headers: {
          ...options?.headers,
        },
      });
    } catch (error) {
      console.log("second call api error", error)
      return response;
    }
  }

  return response;
};
