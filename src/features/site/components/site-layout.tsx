import type { ReactNode } from "react";
import { SiteFooter } from "@/features/site/components/site-footer";
import { SiteHeader } from "@/features/site/components/site-header";
import { cn } from "@/lib/utils";

/** Set `overlayHeader` when the page starts with a full-screen photo: the header then sits on top of it. */
export function SiteLayout({
  overlayHeader = false,
  children,
}: {
  overlayHeader?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="bg-background text-foreground flex min-h-svh flex-col">
      <SiteHeader overlay={overlayHeader} />
      <main className={cn("flex-1", !overlayHeader && "pt-16")}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
