import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - DazLng",
  description: "Gérez vos nœuds Lightning Network",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
