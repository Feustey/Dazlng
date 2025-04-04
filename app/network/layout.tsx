import type { Metadata } from "next";
import Layout from "@components/Layout";

export const metadata = {
  title: "Dazling - Network",
  description: "Network view for Dazling",
};

export default function NetworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Retourner directement les enfants, ClientLayout gère la structure
  return <>{children}</>;
}
