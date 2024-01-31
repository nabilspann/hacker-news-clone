import awsLambdaFastify from "@fastify/aws-lambda";
// import { Config, Context, Handler, HandlerContext, HandlerEvent } from "@netlify/functions";
import { initServer } from "server";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

const connectionString = process.env.DATABASE_URL;
export const client = postgres(connectionString);

export const db: any = drizzle(client);

const proxy = awsLambdaFastify(initServer(db));
const handler = proxy;

export { handler }
