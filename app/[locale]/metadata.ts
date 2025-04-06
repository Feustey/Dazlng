import { Metadata } from "next";
import { siteConfig } from "../config/metadata";

export const metadata: Metadata = {
  title: "Daznode - Votre Portail Lightning Network",
  description:
    "Daznode vous permet de gérer facilement vos paiements Bitcoin sur le réseau Lightning. Explorez les statistiques du réseau, gérez vos canaux et effectuez des transactions en toute simplicité.",
  alternates: {
    canonical: siteConfig.url,
  },
};
