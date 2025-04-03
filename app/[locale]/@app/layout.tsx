import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application - Dazling",
  description: "Application principale de Dazling",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
