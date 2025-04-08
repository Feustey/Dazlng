import { initTRPC } from "@trpc/server";
import { Context } from "./context";
import { router, publicProcedure } from "./trpc";
import { z } from "zod";

const t = initTRPC.context<Context>().create();

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `Bonjour ${input.name ?? "monde"}!`,
      };
    }),
});

export type AppRouter = typeof appRouter;
