import { inferAsyncReturnType } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { auth } from "@/auth";

export async function createTRPCContext(opts: FetchCreateContextFnOptions) {
  const session = await auth();
  return {
    req: opts.req,
    session,
  };
}

export type Context = inferAsyncReturnType<typeof createTRPCContext>;
