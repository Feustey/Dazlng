import type { Metadata } from "next";

const metadata: Metadata = {
  title: "DazNode - Lightning Node Manager",
  description: "Gérez et surveillez votre nœud Lightning Network avec DazNode",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://dazno.de"),
  alternates: {
    canonical: "https://dazno.de",
  },
};

export default metadata;
