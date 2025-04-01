import type { Metadata } from "next";
import metadata from "./metadata";
import ClientLayout from "@/ClientLayout";

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
