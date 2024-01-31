import { Kysely, PostgresDialect } from "kysely";
import { Kyselify } from "drizzle-orm/kysely";
import pg from "pg";
import "dotenv/config";
import { users, posts, comments } from "./schemas";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

if (!process.env.DATABASE_PASSWORD) {
  throw new Error("DATABASE_PASSWORD is missing");
}

// if (!process.env.SSL_CA) {
//   throw new Error("SSL_CA is missing");
// }

const connectionString = process.env.DATABASE_URL;
const password = process.env.DATABASE_PASSWORD;
// const sslCa = process.env.SSL_CA;

export interface KyselyDatabase {
    profiles: Kyselify<typeof users>,
    posts: Kyselify<typeof posts>,
    comments: Kyselify<typeof comments>
};

let tmp = new Pool({
  database: "postgres",
  host: "aws-0-us-west-1.pooler.supabase.com",
  port: 6543,
  user: "postgres.tvhazjxyrbelmznnsluy",
  password,
  // ssl: {
  //   ca: sslCa
  // }
});
// setTimeout(()=>{
//   console.log("connection ending")
//   tmp.end()
// }, 5e3)

export const kyselyDb = new Kysely<KyselyDatabase>({
  dialect: new PostgresDialect({
    pool: new Pool({
        connectionString: ""
    })
    // pool: tmp,
  }),
});
