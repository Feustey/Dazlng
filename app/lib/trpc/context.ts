import { inferAsyncReturnType } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { Session } from "next-auth";

export const createContext = async (_opts: CreateNextContextOptions) => {
  return {
    session: null,
  };
};

export type Context = {
  session: Session | null;
};
