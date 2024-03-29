import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { FastifyTRPCPluginOptions, fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import cors from "@fastify/cors";
import { routes, type Routes } from "./trpc/routes";
import { db } from "./db";
import { createContext } from "./context";
import { pathToFileURL } from "url";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { posts } from "./db/schemas";
import "dotenv/config";

if (!process.env.NODE_ENV) {
  throw new Error("SPROJECT_URL is missing");
}

const devCors = process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : [];

export function initServer() {
  const fastify = Fastify({
    logger: true,
  });
  fastify.register(cors, {
    origin: [
      "https://nabil-hacker-news-clone.netlify.app",
      ...devCors
    ],
    credentials: true,
  });

  fastify.get("/", async (req, res) => {
    res.send({ ping: "pong" });
  });

  migrate(db, { migrationsFolder: "./migrations" })
    .then(() => console.log("Migrations complete!"))
    .catch((err: any) => {
      console.error("Migrations failed!", err);
      process.exit(1);
    });

  fastify.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
      router: routes,
      createContext,
      onError({ path, error }) {
        // report to error monitoring
        console.error(`Error in tRPC handler on path '${path}':`, error);
      },
    } satisfies FastifyTRPCPluginOptions<Routes>["trpcOptions"],
  });

  fastify.register(fastifyCookie);
  return fastify;
}

