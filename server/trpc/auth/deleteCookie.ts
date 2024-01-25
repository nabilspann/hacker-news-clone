import { z } from "zod";

/***   Query   ***/
import { publicProcedure } from "../trpc";
export default publicProcedure.input(z.object({domain: z.string()})).query(async ({input, ctx }) => {
  const { domain } = input;
  ctx.setCookie(
    authTokenCookieName,
    "",
    `path=/;domain=${domain};expires=Thu, 01 Jan 1970 00:00:01 GMT;`
  );
  ctx.setCookie(
    refreshTokenCookieName,
    "",
    `path=/;domain=${domain};expires=Thu, 01 Jan 1970 00:00:01 GMT;`
  );

    return { message: "Cookies deleted!" };
});

/***   Demo   ***/
// npm run demo:trpc auth/deleteCookie
import type { DemoClient } from "../routes";
import { authTokenCookieName, refreshTokenCookieName } from "../../utils/constants";
export async function demo(trpc: DemoClient) {
  return await trpc.auth.deleteCookie.query({ domain: "localhost" });
}
