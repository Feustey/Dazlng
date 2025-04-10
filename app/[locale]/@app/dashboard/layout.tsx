import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard - Daznode",
  description: "Gérez vos nœuds Lightning Network",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
