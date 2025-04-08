import { Metadata } from "next";
import DashboardStats from "../../components/DashboardStats";
import ChannelPerformance from "../../components/ChannelPerformance";
import ActiveChannels from "../../components/ActiveChannels";

export const metadata: Metadata = {
  title: "Tableau de Bord | DazLng",
  description:
    "Gérez vos nœuds Lightning Network et suivez leurs performances en temps réel.",
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 text-transparent bg-clip-text">
          Tableau de Bord
        </h1>
        <p className="text-muted-foreground">
          Bienvenue sur votre espace de gestion Lightning Network
        </p>
      </div>

      <DashboardStats />

      <div className="grid gap-8 md:grid-cols-2">
        <ChannelPerformance />
        <ActiveChannels />
      </div>
    </div>
  );
}
