import Header from "../components/Header";
import { Footer } from "../components/Footer";

export const metadata = {
  title: "Dazling - Public",
  description: "Public pages for Dazling",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Retourner directement les enfants, le layout global s'occupe du reste
  return <>{children}</>;
}
