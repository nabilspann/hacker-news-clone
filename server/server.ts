import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import cors from "@fastify/cors";
import { routes } from "./trpc/routes";
import { db } from "./db";
import { createContext } from "./context";

const fastify = Fastify({
  logger: true,
});

// Declare a route
// fastify.get("/ping", function (request, reply) {
//   reply.send({ pong: "hello world" });
// });

const main = async () => {
  await fastify.register(cors, {
    origin: ["http://localhost:3000"],
    credentials: true,
  });

  await migrate(db, { migrationsFolder: "./migrations" })
    .then(() => console.log("Migrations complete!") )
    .catch((err) => {
      console.error("Migrations failed!", err);
      process.exit(1);
    });

  await fastify.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: { router: routes, createContext },
  });

  fastify.register(fastifyCookie);

  fastify.get('/getAuthTokenCookies', (req, reply): void => {
    reply.send({ test: "Cookie set" });
  });

  // Run the server!
  fastify.listen({ port: 8080 }, function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
};

main();
