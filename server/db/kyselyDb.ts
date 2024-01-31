import { Kysely, PostgresDialect } from "kysely";
import { Kyselify } from "drizzle-orm/kysely";
import pg from "pg";
import "dotenv/config";
import { users, posts, comments } from "./schemas";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

const connectionString = process.env.DATABASE_URL;

export interface KyselyDatabase {
    profiles: Kyselify<typeof users>,
    posts: Kyselify<typeof posts>,
    comments: Kyselify<typeof comments>
};

export const kyselyDb = await new Kysely<KyselyDatabase>({
  dialect: await new PostgresDialect({
    pool: await new Pool({
        connectionString
    })
  }),
});
