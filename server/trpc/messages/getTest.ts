import { posts, postsTableName } from "../../db/schemas";
import "dotenv/config";

/***   INPUT   ***/
// import { createSelectSchema } from "drizzle-zod";
// export const getPostInput = createSelectSchema(posts);

/***   Query   ***/
import { publicProcedure } from "../trpc";
import { kyselyDb } from "../../db/kyselyDb";
import { db } from "../../db";
import { supabaseClient } from "../../db/supabase";
export default publicProcedure.query(async () => {
    const initDate = Date.now();
  const postsRes = await kyselyDb
    .selectFrom(postsTableName)
    .innerJoin("profiles as users", (join) =>
      join.onRef("posts.user_id", "=", "users.user_id")
    )
    .select([
      "posts.user_id",
      "post_id",
      "username",
      "posts.created_at",
      "title",
    ])
    .execute();
    // const postsRes = await db.select().from(posts);
    // const postsRes = await supabaseClient.from(postsTableName).select()
    // kyselyDb.connection
    console.log("postsRes", postsRes)
  const laterDate = Date.now()
    console.log("diff time", laterDate - initDate);

  return "test";
});

/***   Demo   ***/
// npm run demo:trpc messages/getTest
// import type { DemoClient } from "../routes";
// export async function demo(trpc: DemoClient) {
//   return await trpc.messages.getTest.query();
// }
