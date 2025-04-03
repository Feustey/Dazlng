// import Layout from "@/app/components/Layout"; // Temporairement commenté pour diagnostic

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // Retourner directement les enfants, le layout global s'occupe de la structure
  return <>{children}</>;
}
