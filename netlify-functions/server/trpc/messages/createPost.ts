import { posts, postsTableName } from "../../db/schemas";
import { censorWords } from "../../utils/badWordChecker";

/***   INPUT   ***/
import { createInsertSchema } from "drizzle-zod";
const createPostInput = createInsertSchema(posts)
  .omit({ post_id: true, created_at: true, user_id: true, });


/***   Query   ***/
import { protectedProcedure } from "../trpc";
import { kyselyDb } from "../../db/kyselyDb";
export default (
  protectedProcedure
    .input(createPostInput)
    .mutation(async ({input, ctx}) => {
      const { title, description } = input;
      const user = ctx.user;

      if(!title){
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please enter title."
        });
      };

      const filteredTitle = censorWords(title);
      const filteredDescription = description ? censorWords(description) : description;

      const response = await kyselyDb
        .insertInto(postsTableName)
        .values({
          user_id: user.id,
          title: filteredTitle,
          description: filteredDescription,
        })
        .returningAll()
        .executeTakeFirstOrThrow();
      return response;
    })
)


/***   Demo   ***/
// npm run demo:trpc messages/createPost
import type { DemoClient } from "../routes";
import { TRPCError } from "@trpc/server";
export async function demo(trpc: DemoClient) {
  return await trpc.messages.createPost.mutate({
    title: "",
    description: "",
  })
}
