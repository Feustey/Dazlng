import type { Metadata } from "next";

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export const metadata: Metadata = {
  title: "Messages - Dazling",
  description: "Gérez vos messages Lightning Network",
};
