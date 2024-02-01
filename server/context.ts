import { inferAsyncReturnType } from "@trpc/server";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { authTokenCookieName, refreshTokenCookieName } from "./utils/constants";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

type TokenType = string | undefined;
export function createContext(
  { req, res }: CreateFastifyContextOptions
) {
  //   const user = { name: req.headers.username ?? "anonymous" };
  const cookiesArr = req.headers.cookie?.split(";") || [];

  let refreshToken: TokenType = undefined;
  let authToken: TokenType = undefined;
  cookiesArr?.forEach((cookie) => {
    const cookieKeyValue = cookie.split("=");
    if (
      cookieKeyValue.length === 2 &&
      cookieKeyValue[0].includes(refreshTokenCookieName)
    ) {
      refreshToken = cookieKeyValue[1];
    }
    if (
      cookieKeyValue.length === 2 &&
      cookieKeyValue[0].includes(authTokenCookieName)
    ) {
      authToken = cookieKeyValue[1];
    }
  });
  return {
    authToken,
    refreshToken,
    setCookie: (k: string, v: string, opts: string = "") =>
      res.header("set-cookie", `${k}=${v}; ${opts}`),
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
