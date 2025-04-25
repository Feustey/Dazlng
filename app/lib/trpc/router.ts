import { initTRPC } from "@trpc/server";
import { createContext } from "./context";

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  // Définissez vos procédures ici
  hello: publicProcedure.query(() => {
    return { greeting: "Hello, world!" };
  }),
});

export type AppRouter = typeof appRouter;
