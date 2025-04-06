import type { Metadata } from "next";
import ClientLayout from "@/app/ClientLayout";

export const metadata: Metadata = {
  title: "Bot IA - Dazling",
  description: "Interagissez avec le Bot IA pour gérer votre nœud.",
};

export default function BotIALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
