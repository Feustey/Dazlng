import { inferAsyncReturnType } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export async function createTRPCContext(opts: FetchCreateContextFnOptions) {
  return {
    req: opts.req,
  };
}

export type Context = inferAsyncReturnType<typeof createTRPCContext>;
