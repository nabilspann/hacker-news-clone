import { supabaseClient } from "../../db/supabase";

/***   Query   ***/
import { publicProcedure } from "../trpc";
export default publicProcedure.query(async ({ctx}) => {
    ctx.setCookie("vercona-test", "vercona-test=setting_by_header");
    ctx.setCookie("vercona-test2", "vercona-test=another_settings");

    return { message: "auth cookie sent" };
});

/***   Demo   ***/
// npm run demo:trpc auth/authCookie
import type { DemoClient } from "../routes";
export async function demo(trpc: DemoClient) {
  return await trpc.auth.authCookie.query();
}
