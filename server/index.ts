import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import cors from "@fastify/cors";
import { routes } from "./trpc/routes";
import { db } from "./db";
import { createContext } from "./context";
import { pathToFileURL } from "url";

export function initServer() {
  const fastify = Fastify({
    logger: true,
  });
  fastify.register(cors, {
    origin: ["http://localhost:3000"],
    credentials: true,
  });

  fastify.get("/.netlify/functions/server", (req, res) => {
    res.send({ ping: "pong" });
  });

  // migrate(db, { migrationsFolder: "./migrations" })
  //   .then(() => console.log("Migrations complete!"))
  //   .catch((err: any) => {
  //     console.error("Migrations failed!", err);
  //     process.exit(1);
  //   });

  fastify.register(fastifyTRPCPlugin, {
    prefix: "/.netlify/functions/server/trpc",
    trpcOptions: { router: routes, createContext },
  });

  fastify.register(fastifyCookie);
  return fastify;
}

