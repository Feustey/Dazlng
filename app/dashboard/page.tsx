import { Metadata } from "next";
import type { NextPage } from "next";

export const metadata: Metadata = {
  title: "Dashboard - DazLng",
  description: "Gérez vos nœuds Lightning Network",
};

const DashboardPage: NextPage = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Bienvenue sur votre tableau de bord DazLng.</p>
    </main>
  );
};

export default DashboardPage;
