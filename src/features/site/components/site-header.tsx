import { Link } from "@tanstack/react-router";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { hash: "galleries", label: "Galleries" },
  { hash: "about", label: "About" },
  { hash: "pricing", label: "Pricing" },
  { hash: "contact", label: "Contact" },
];

export function SiteHeader({ overlay }: { overlay: boolean }) {
  const site = useSiteSettings();

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
          className="font-heading min-w-0 truncate text-lg font-semibold tracking-tight"
        >
          {site.name}
        </Link>
        <nav
          aria-label="Main"
          className="hidden items-center gap-6 text-xs tracking-[0.2em] uppercase sm:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link key={link.hash} to="/" hash={link.hash}>
              {link.label}
            </Link>
          ))}
        </nav>
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon-lg"
                aria-label="Open menu"
                className="-mr-2 hover:bg-transparent sm:hidden"
              />
            }
          >
            <MenuIcon className="size-6" />
          </SheetTrigger>
          <SheetContent side="right" className="px-8 pt-20">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <nav
              aria-label="Main"
              className="flex flex-col gap-6 text-sm tracking-[0.2em] uppercase"
            >
              {NAV_LINKS.map((link) => (
                <SheetClose
                  key={link.hash}
                  nativeButton={false}
                  render={<Link to="/" hash={link.hash} />}
                >
                  {link.label}
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
