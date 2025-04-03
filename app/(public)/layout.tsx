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
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      <Footer />
    </div>
  );
}
