import { Metadata } from "next";
import "./globals.css";
import { AlertProvider } from "./contexts/AlertContext";
import { ThemeProvider } from "./components/ThemeProvider";

export const metadata: Metadata = {
  title: "DazLng",
  description: "DazLng - Your Language Learning Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AlertProvider>{children}</AlertProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
