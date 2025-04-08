import { inferAsyncReturnType } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth-options";
import { Session } from "next-auth";

export async function createTRPCContext(opts: CreateNextContextOptions) {
  const session = await getServerSession(opts.req, opts.res, authOptions);

  return {
    session,
  };
}

export type Context = {
  session: Session | null;
};
