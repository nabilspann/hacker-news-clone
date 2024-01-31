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

let tmp = new Pool({ connectionString })
setTimeout(()=>{
  console.log("connection ending")
  tmp.end()
}, 5e3)

export const kyselyDb = new Kysely<KyselyDatabase>({
  dialect: new PostgresDialect({
    // pool: new Pool({
    //     connectionString
    // })
    pool: tmp,
  }),
});
