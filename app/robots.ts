import { MetadataRoute } from \next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NODE_ENV === "productio\n 
    ? "https://dazno.de" 
    : "http://localhost:3001"

  return {
    rules: [
      {
        userAgent: "*"allow: "/"disallow: [
          "/admin/""/api/"/user/"/checkout/"/auth/"/_next/"/static/""*.jso\n*.xml"",
        ]},
      {
        userAgent: "Googlebot""
        allow: "/"disallow: [
          "/admin/"/api/"/user/"/checkout/""/auth/",]},
      {
        userAgent: "Bingbot"
        allow: "/"disallow: [
          "/admin/"/api/"/user/"/checkout/""
          "/auth/',
        ]},
    ]
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUr,l}
} `