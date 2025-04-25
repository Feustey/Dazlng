import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { initTRPC } from "@trpc/server";
import { z } from "zod";

// Créer un routeur tRPC de base
const t = initTRPC.create();
const router = t.router;
const publicProcedure = t.procedure;

// Définir un routeur simple
export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        message: `Bonjour ${input.name ?? "monde"}!`,
        timestamp: new Date().toISOString(),
      };
    }),
  stats: publicProcedure.query(() => {
    return {
      nodes: 12500,
      channels: 35800,
      capacity: "1250000000000",
      last_update: new Date().toISOString(),
    };
  }),
});

// Définir le contexte
export const createContext = async () => {
  return {
    session: null, // En production, ici serait la session de l'utilisateur
  };
};

// Types exportés pour être utilisés par les clients
export type AppRouter = typeof appRouter;

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };
