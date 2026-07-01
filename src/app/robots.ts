import { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/brand.constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/journal/",
          "/dashboard/",
          "/goals/",
          "/insights/",
          "/settings/",
          "/profile/",
          "/chat/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
