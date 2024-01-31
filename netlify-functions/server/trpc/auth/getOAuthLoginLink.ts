
import { supabaseClient } from "../../db/supabase";
import { z } from "zod";

/***   Query   ***/
import { publicProcedure } from "../trpc";
export default publicProcedure
  .input(z.object({ provider: z.enum(["google", "github"]) }))
  .query(async ({ input, ctx }) => {
    const { provider } = input;
    console.log("provider", provider)
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider,
    });

    console.log("data", data);

    return data;
  });

/***   Demo   ***/
// npm run demo:trpc auth/getOAuthLoginLink
import type { DemoClient } from "../routes";
export async function demo(trpc: DemoClient) {
  return await trpc.auth.getOAuthLoginLink.query({ provider: "github" });
}