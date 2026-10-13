import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader({ overlay }: { overlay: boolean }) {
  return (
    <header
      className={cn(
        "inset-x-0 top-0 z-50",
        overlay
          ? "absolute text-white"
          : "border-border bg-background/70 fixed border-b backdrop-blur-md",
      )}
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-between gap-6 px-6",
          overlay ? "h-24 sm:px-12" : "h-16 max-w-6xl",
        )}
      >
        <Link
          to="/"
          className="font-heading text-lg font-semibold tracking-tight"
        >
          {SITE.name}
        </Link>
        <nav
          aria-label="Main"
          className="flex items-center gap-6 text-xs tracking-[0.2em] uppercase"
        >
          <Link to="/" hash="galleries">
            Galleries
          </Link>
          <Link to="/" hash="about">
            About
          </Link>
          <Link to="/" hash="pricing">
            Pricing
          </Link>
          <Link to="/" hash="contact">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
