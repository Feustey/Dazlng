import type { Metadata } from "next";

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export const metadata: Metadata = {
  title: "Bot IA - Dazling",
  description: "Interagissez avec le Bot IA pour gérer votre nœud.",
};

export default function BotIALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
