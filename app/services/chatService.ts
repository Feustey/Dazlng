import { router, publicProcedure } from "@/app/lib/trpc/trpc";
import { z } from "zod";

const messageSchema = z.object({
  content: z.string(),
  role: z.enum(["user", "assistant"]),
});

type MessageInput = z.infer<typeof messageSchema>;

export const chatRouter = router({
  sendMessage: publicProcedure
    .input(messageSchema)
    .mutation(async ({ input }: { input: MessageInput }) => {
      // Implémentez la logique d'envoi de message ici
      return {
        success: true,
        message: "Message envoyé avec succès",
      };
    }),
});

export async function processChatMessage(_input: string) {
  // ... existing code ...
}
