import { initServer } from ".";
import "dotenv/config";

if (!process.env.NODE_ENV) {
  throw new Error("SPROJECT_URL is missing");
}

initServer().listen({ port: 8000, host: process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost" }, function (err: any) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
