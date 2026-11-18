import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://customglass.example.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/contact", "/products"],
        disallow: [
          "/admin",
          "/admin/*",
          "/checkout",
          "/checkout/*",
          "/order-confirmation",
          "/order-confirmation/*",
          "/api/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
