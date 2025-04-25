import { initializeServices } from "./init";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
  app,
}: {
  children: React.ReactNode;
  app: React.ReactNode;
}) {
  // Initialiser l'application
  await initializeServices();

  return (
    <html suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-background antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
