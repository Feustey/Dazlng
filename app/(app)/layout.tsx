import Layout from "../components/Layout"; // Correction du chemin

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}
