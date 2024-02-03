import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

if (!process.env.PROJECT_URL) {
  throw new Error("SPROJECT_URL is missing");
}

if (!process.env.SUPABASE_KEY) {
  throw new Error("SUPABASE_KEY is missing");
}

export const supabase = createClient(
  process.env.PROJECT_URL,
  process.env.SUPABASE_KEY
);


if (!process.env.PROJECT_URL_DEV) {
  throw new Error("SPROJECT_URL is missing");
}

if (!process.env.SUPABASE_KEY_DEV) {
  throw new Error("SUPABASE_KEY is missing");
}

export const supabaseDev = createClient(
  process.env.PROJECT_URL_DEV,
  process.env.SUPABASE_KEY_DEV
);