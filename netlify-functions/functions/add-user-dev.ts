import { Config, Context } from "@netlify/functions";
import {
  names,
  NumberDictionary,
  uniqueNamesGenerator,
} from "unique-names-generator";
import "dotenv/config";
import { supabaseDev } from "../api";

if (!process.env.AUTHORIZATION_KEY_DEV) {
  throw new Error("AUTHORIZATION_KEY is missing");
}

interface ErrorObj extends Error {
  code?: number;
}

export default async (req: Request, context: Context) => {
  const authorizationKey = req.headers.get("authorization");

  if (!(process.env.AUTHORIZATION_KEY_DEV === authorizationKey)) {
    const authorizationError: ErrorObj = new Error("NOT AUTHORIZED");
    authorizationError.code = 401;
    throw authorizationError;
  }

  const reqBody = await req.json();
  if (reqBody) {
      const user_id = reqBody.record.id;

      const numberDictionary = NumberDictionary.generate({
        min: 100,
        max: 999,
      });

      const username: string = uniqueNamesGenerator({
        dictionaries: [names, numberDictionary],
      });

      const { data, error } = await supabaseDev
        .from("profiles")
        .insert({ user_id, username, is_sign_up: true })
        .select()

      return new Response(JSON.stringify({
        data,
        error
      }));
  }

  return new Response(JSON.stringify("No body"));
};

export const config: Config = {
  path: "/add-user-dev",
};
