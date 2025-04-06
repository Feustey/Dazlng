import type { Metadata } from "next";
import ClientLayout from "@/app/ClientLayout";

export const metadata: Metadata = {
  title: "Settings - Dazling",
  description: "Configurez vos paramètres de l'application.",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
