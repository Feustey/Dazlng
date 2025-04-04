import type { Metadata } from "next";
import ClientLayout from "@components/ClientLayout";

export const metadata: Metadata = {
  title: "Messages - Dazling",
  description: "Gérez vos messages et conversations.",
};

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
