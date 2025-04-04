import type { Metadata } from "next";

const metadata: Metadata = {
  title: "DazLng - Lightning Node Manager",
  description: "Monitor and manage your Lightning Network node",
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
  metadataBase: new URL("https://dazlng.inoval.io"),
  alternates: {
    canonical: "https://dazlng.inoval.io",
  },
};

export default metadata;
