import { supabaseClient } from "../../db/supabase";
import { users } from "../../db/schemas";
import { detectBadWords } from "../../utils/badWordChecker";

/***   INPUT   ***/
import { createInsertSchema } from "drizzle-zod";
export const updateUserInput = createInsertSchema(users)
  .pick({ username: true });

/***   Query   ***/
import { protectedProcedure } from "../trpc";
export default protectedProcedure
  .input(updateUserInput)
  .mutation(async (req) => {
    const { username } = req.input;
    const authToken = req.ctx.authToken;
    const { data } = await supabaseClient.auth.getUser(authToken);

    if(!username){
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Please enter an username!",
      });
    };

    const isBadWord = detectBadWords(username);

    if (isBadWord) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Username taken.",
      });
    };

    const getUserRes = await kyselyDb
      .updateTable("profiles")
      .set({
        username,
        is_sign_up: false,
      })
      .where("user_id", "=", data.user!.id)
      .returningAll()
      .executeTakeFirstOrThrow();

    return getUserRes;
  });

/***   Demo   ***/
// npm run demo:trpc auth/updateUser
import type { DemoClient } from "../routes";
import { kyselyDb } from "../../db/kyselyDb";
import { TRPCError } from "@trpc/server";
export async function demo(trpc: DemoClient) {
  return await trpc.auth.updateUser.mutate({ username: "Genos" });
}
