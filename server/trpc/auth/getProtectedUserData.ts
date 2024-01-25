import { supabaseClient } from "../../db/supabase";

/***   Query   ***/
import { protectedProcedure } from "../trpc";
export default protectedProcedure.query(async ({ ctx }) => {
  const { authToken } = ctx;

  const userData = await supabaseClient.auth.getUser(authToken);

  return userData;
});

/***   Demo   ***/
// npm run demo:trpc auth/getProtectedUserData
import type { DemoClient } from "../routes";
export async function demo(trpc: DemoClient) {
  return await trpc.auth.getProtectedUserData.query();
}
