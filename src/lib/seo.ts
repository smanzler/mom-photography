import { SITE_URL } from "@/lib/site";
import type { SiteSettings } from "@/lib/site-settings";

/** The title of the homepage, and of any page without its own. */
export const buildSiteTitle = ({ name, tagline }: SiteSettings) =>
  tagline ? `${name} — ${tagline}` : name;

/** Page-level `head` for a route. Pass the full `<title>`, not just the page name. */
export const buildPageHead = ({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) => {
  const url = `${SITE_URL}${path}`;

  return {
    links: [{ rel: "canonical", href: url }],
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
  };
};
