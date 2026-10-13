import { Link } from "@tanstack/react-router";
import { useSiteSettings } from "@/hooks/use-site-settings";

export function SiteFooter() {
  const site = useSiteSettings();

  return (
    <footer className="border-border border-t py-10">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 text-sm sm:flex-row sm:justify-between">
        <Link to="/" className="text-foreground">
          {site.name}
        </Link>
        <p>
          &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
