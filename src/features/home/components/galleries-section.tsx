import { Link } from "@tanstack/react-router";
import { PhotoImage } from "@/components/photo-image";
import type { PhotoImageSource } from "@/components/photo-image";

export function GalleriesSection({
  galleries,
}: {
  galleries: {
    id: string;
    slug: string;
    title: string;
    coverPhoto: PhotoImageSource | null;
  }[];
}) {
  return (
    <section
      id="galleries"
      className="flex min-h-svh scroll-mt-16 flex-col justify-center gap-16 py-24"
    >
      <h2 className="px-6 text-center text-5xl leading-none sm:text-6xl">
        Galleries
      </h2>
      {galleries.length === 0 ? (
        <p className="text-muted-foreground px-6 text-center">
          New work is on its way.
        </p>
      ) : (
        <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
          {galleries.map((gallery) => (
            <Link
              key={gallery.id}
              to="/$gallerySlug"
              params={{ gallerySlug: gallery.slug }}
              className="group relative block aspect-[4/5] overflow-hidden bg-neutral-800 text-white"
            >
              {gallery.coverPhoto && (
                <PhotoImage
                  photo={gallery.coverPhoto}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="absolute inset-0 h-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                />
              )}
              <span
                aria-hidden
                className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/35"
              />
              <span className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-2.5 px-6 text-center">
                <span className="font-heading text-5xl leading-none">
                  {gallery.title}
                </span>
                <span className="text-[11px] tracking-[0.24em] uppercase">
                  View gallery
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
