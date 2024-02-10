import { TRPCError, initTRPC } from "@trpc/server";
import { ZodError } from "zod";
import { createContext } from "../context";
import { supabaseClient } from "../db/supabase";

export const t = initTRPC.context<typeof createContext>().create({
  errorFormatter({ shape, error }) {
    const isInputValidationError =
      error.code === "BAD_REQUEST" && error.cause instanceof ZodError;
    return {
      ...shape,
      data: {
        ...shape.data,
        inputValidationError: isInputValidationError
          ? error.cause.flatten()
          : null,
      },
    };
  },
});

export const middleware = t.middleware;

const isAuthorized = middleware(async (opts) => {
  const { ctx } = opts;
  const authToken = ctx.authToken;

  console.log("authToken", authToken);

  const userData = await supabaseClient.auth.getUser(authToken);
  console.log("userData", userData);
  if (!userData.data.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Please login first!" });
  }

  return opts.next({
    ctx: {
      authToken,
      user: userData.data.user
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthorized);
