import Layout from "@/components/Layout"; // Utilisation de l'alias

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // Retourner directement les enfants, le layout global s'occupe de la structure
  return <>{children}</>;
}
