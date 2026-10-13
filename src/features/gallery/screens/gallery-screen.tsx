import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { PhotoImage } from "@/components/photo-image";
import type { PhotoImageSource } from "@/components/photo-image";
import { GALLERY_LAYOUTS } from "@/features/gallery/components/layouts/gallery-layouts";
import { Lightbox } from "@/features/gallery/components/lightbox";
import type { GalleryLayoutPhoto } from "@/features/gallery/lib/gallery-layout-props";
import { SiteLayout } from "@/features/site/components/site-layout";
import type { Layout } from "@/lib/gallery-layout";

export function GalleryScreen({
  gallery,
}: {
  gallery: {
    title: string;
    description: string | null;
    layout: Layout;
    coverPhoto: PhotoImageSource | null;
    photos: GalleryLayoutPhoto[];
    nextGallery: { slug: string; title: string } | null;
  };
}) {
  const GalleryLayout = GALLERY_LAYOUTS[gallery.layout];
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const title = (
    <div className="flex flex-col items-center gap-3.5 px-6 text-center">
      <p className="text-xs tracking-[0.24em] uppercase">Gallery</p>
      <h1 className="text-6xl leading-[0.95] sm:text-8xl lg:text-9xl">
        {gallery.title}
      </h1>
    </div>
  );

  return (
    <SiteLayout overlayHeader={gallery.coverPhoto !== null}>
      {gallery.coverPhoto ? (
        <section className="relative h-svh min-h-[32rem] overflow-hidden bg-neutral-900 text-white">
          <PhotoImage
            photo={gallery.coverPhoto}
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 h-full object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-x-0 bottom-16">{title}</div>
        </section>
      ) : (
        <div className="pt-24">{title}</div>
      )}

      {gallery.description && (
        <p className="font-heading mx-auto max-w-2xl px-6 pt-24 text-center text-2xl leading-snug whitespace-pre-line sm:text-3xl">
          {gallery.description}
        </p>
      )}

      <div className="mx-auto max-w-7xl px-2 py-20 sm:px-6">
        <GalleryLayout photos={gallery.photos} onOpen={setOpenIndex} />
      </div>

      <section className="bg-cream flex flex-col items-center gap-5 px-6 py-24 text-center">
        {gallery.nextGallery && (
          <>
            <p className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
              Next gallery
            </p>
            <Link
              to="/$gallerySlug"
              params={{ gallerySlug: gallery.nextGallery.slug }}
              className="font-heading text-5xl leading-none hover:opacity-70 sm:text-7xl"
            >
              {gallery.nextGallery.title} →
            </Link>
          </>
        )}
        <Link
          to="/"
          hash="contact"
          className="mt-4 text-xs tracking-[0.2em] uppercase underline underline-offset-8"
        >
          Book a session
        </Link>
      </section>
      <Lightbox
        photos={gallery.photos}
        index={openIndex}
        onIndexChange={setOpenIndex}
      />
    </SiteLayout>
  );
}
