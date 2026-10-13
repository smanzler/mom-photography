import type { ComponentProps } from "react";
import type { PhotoImageSource } from "@/components/photo-image";
import { GalleryCard } from "@/features/gallery/components/gallery-card";
import { ContactSection } from "@/features/home/components/contact-section";
import { HeroSlideshow } from "@/features/home/components/hero-slideshow";
import { PricingSection } from "@/features/home/components/pricing-section";
import { SiteLayout } from "@/features/site/components/site-layout";
import { SITE } from "@/lib/site";

export function HomeScreen({
  galleries,
  heroPhotos,
  pricingPackages,
}: {
  galleries: {
    id: string;
    slug: string;
    title: string;
    coverPhoto: PhotoImageSource | null;
  }[];
  heroPhotos: (PhotoImageSource & { id: string })[];
  pricingPackages: ComponentProps<typeof PricingSection>["packages"];
}) {
  const hasHero = heroPhotos.length > 0;

  return (
    <SiteLayout overlayHeader={hasHero}>
      {hasHero && <HeroSlideshow photos={heroPhotos} />}
      <div
        id="galleries"
        className="mx-auto flex min-h-svh max-w-6xl scroll-mt-16 flex-col justify-center gap-12 px-6 py-16"
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-semibold tracking-tight">{SITE.name}</h1>
          <p className="text-muted-foreground">{SITE.tagline}</p>
        </div>
        {galleries.length === 0 ? (
          <p className="text-muted-foreground">New work is on its way.</p>
        ) : (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {galleries.map((gallery) => (
              <GalleryCard key={gallery.id} gallery={gallery} />
            ))}
          </div>
        )}
      </div>
      {pricingPackages.length > 0 && (
        <PricingSection packages={pricingPackages} />
      )}
      <ContactSection
        sessions={pricingPackages.map((pricingPackage) => pricingPackage.name)}
      />
    </SiteLayout>
  );
}
