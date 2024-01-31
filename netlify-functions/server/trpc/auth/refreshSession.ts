import { z } from "zod";
import { supabaseClient } from "../../db/supabase"


/***   Query   ***/
import { publicProcedure } from "../trpc";
export default (
  publicProcedure
    .input(z.object({ domain: z.string() }))
    .query(async ({ input, ctx }) => {
      const { refreshToken } = ctx;
      const { domain } = input;
      if(!refreshToken){
        return {
          session: null,
          user: null
        }
      }

      const { data } = await supabaseClient.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if(data.session){
        const accessToken = data.session.access_token;
        const accessTokenExpirationDate = new Date(
          Number(data.session.expires_at) * 1000
        );

        const refreshTokenExpirationDate = new Date();
        refreshTokenExpirationDate.setDate(refreshTokenExpirationDate.getDate() + 5);
        const refreshToken = data.session.refresh_token;

        ctx.setCookie(
          authTokenCookieName,
          accessToken,
          `path=/;domain=${domain};expires=${accessTokenExpirationDate}; HttpOnly; Secure; SameSite=Strict`
        );
        ctx.setCookie(
          refreshTokenCookieName,
          refreshToken,
          `path=/;domain=${domain};expires=${refreshTokenExpirationDate}; HttpOnly; Secure; SameSite=Strict`
        );
      }

      return data;
    })
)


/***   Demo   ***/
// npm run demo:trpc auth/refreshSession
import type { DemoClient } from "../routes";
import { authTokenCookieName, refreshTokenCookieName } from "../../utils/constants";
export async function demo(trpc: DemoClient) {
  return await trpc.auth.refreshSession.query({ domain: "localhost" });
}
