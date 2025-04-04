import fs from "fs";
import path from "path";
import { environments, getEnvironment } from "../app/config/environments";

const generateManifest = () => {
  const env = getEnvironment();
  const { baseUrl } = environments[env];

  const manifest = {
    name: "DazLng",
    short_name: "DazLng",
    description: "Gérez vos nœuds Lightning Network en toute simplicité",
    icons: [
      {
        src: `${baseUrl}/android-chrome-192x192.png`,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: `${baseUrl}/android-chrome-512x512.png`,
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone",
    start_url: baseUrl,
    scope: baseUrl,
  };

  const manifestPath = path.join(process.cwd(), "public", "site.webmanifest");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Manifest généré pour l'environnement ${env}`);
};

generateManifest();
