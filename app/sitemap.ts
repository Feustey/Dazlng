import { siteConfig } from "./config/metadata";

export default async function sitemap() {
  const routes = ["", "/daznode", "/review", "/help", "/about"].map(
    (route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "daily",
      priority: route === "" ? 1 : 0.8,
    })
  );

  // Ajouter les versions localisées
  const localizedRoutes = routes.flatMap((route) => [
    {
      url: `${route.url}/fr`,
      lastModified: route.lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    },
    {
      url: `${route.url}/en`,
      lastModified: route.lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    },
  ]);

  return [...routes, ...localizedRoutes];
}
