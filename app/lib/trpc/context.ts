import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getCurrentUser } from "../auth";

export async function createContext({
  req,
  resHeaders,
}: FetchCreateContextFnOptions) {
  const user = await getCurrentUser();
  return { req, resHeaders, user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
