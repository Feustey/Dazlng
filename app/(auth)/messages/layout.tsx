import type { Metadata } from "next";
import Layout from "../../components/Layout";

export const metadata: Metadata = {
  title: "Messages - Dazling",
  description: "Gérez vos messages Lightning Network",
};

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
