import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Channels - Dazling",
  description: "Gérez vos canaux de communication.",
};

export default function ChannelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
