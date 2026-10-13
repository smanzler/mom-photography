import type { ComponentProps } from "react";
import type { PhotoImageSource } from "@/components/photo-image";
import { AboutSection } from "@/features/home/components/about-section";
import { ContactSection } from "@/features/home/components/contact-section";
import { GalleriesSection } from "@/features/home/components/galleries-section";
import { HeroSlideshow } from "@/features/home/components/hero-slideshow";
import { PricingSection } from "@/features/home/components/pricing-section";
import { SiteLayout } from "@/features/site/components/site-layout";
import { useSiteSettings } from "@/hooks/use-site-settings";

export function HomeScreen({
  galleries,
  heroPhotos,
  pricingPackages,
  about,
}: {
  galleries: ComponentProps<typeof GalleriesSection>["galleries"];
  heroPhotos: (PhotoImageSource & { id: string })[];
  pricingPackages: ComponentProps<typeof PricingSection>["packages"];
  about: ComponentProps<typeof AboutSection>["about"] | null;
}) {
  const site = useSiteSettings();
  const hasHero = heroPhotos.length > 0;

  return (
    <SiteLayout overlayHeader={hasHero}>
      {hasHero && <HeroSlideshow photos={heroPhotos} />}
      <h1 className="sr-only">{site.name}</h1>
      <GalleriesSection galleries={galleries} />
      {about && <AboutSection about={about} />}
      {pricingPackages.length > 0 && (
        <PricingSection packages={pricingPackages} />
      )}
      <ContactSection
        sessions={pricingPackages.map((pricingPackage) => pricingPackage.name)}
      />
    </SiteLayout>
  );
}
