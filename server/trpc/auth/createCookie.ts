import { z } from "zod";
import {
  authTokenCookieName,
  refreshTokenCookieName,
} from "../../utils/constants";

/***   Query   ***/
import { publicProcedure } from "../trpc";
export default publicProcedure
  .input(
    z.object({
      accessToken: z.string(),
      refreshToken: z.string(),
      domain: z.string(),
      accessTokenExpirationDate: z.string(),
      refreshTokenExpirationDate: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    const { domain, accessToken, refreshToken, accessTokenExpirationDate, refreshTokenExpirationDate } =
      input;
    const existingAccessToken = ctx.authToken;
    
    const userData = await supabaseClient.auth.getUser(existingAccessToken);
  
    if(accessToken && !userData.data.user){
        ctx.setCookie(
        authTokenCookieName,
        accessToken,
        `path=/;domain=${domain};expires=${accessTokenExpirationDate}; HttpOnly; Secure; SameSite=Strict`
        );
    }
    if (refreshToken && !userData.data.user) {
      ctx.setCookie(
        refreshTokenCookieName,
        refreshToken,
        `path=/;domain=${domain};expires=${refreshTokenExpirationDate}; HttpOnly; Secure; SameSite=Strict`
      );
    }

    return { message: "Cookies created!" };
  });

/***   Demo   ***/
// npm run demo:trpc auth/createCookie
import type { DemoClient } from "../routes";
import { supabaseClient } from "../../db/supabase";
export async function demo(trpc: DemoClient) {
//   return await trpc.auth.createCookie.query({ accessToken: "", refreshToken: "", domain: "localhost", accessTokenExpirationDate: new Date(), refreshTokenExpirationDate: new Date()});
  return await trpc.auth.createCookie.query({
    accessToken: "",
    refreshToken: "",
    domain: "localhost",
    accessTokenExpirationDate: "",
    refreshTokenExpirationDate: "",
  });

}
