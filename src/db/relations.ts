import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  Photos: {
    galleryPhotos: r.many.GalleryPhotos({
      from: r.Photos.id,
      to: r.GalleryPhotos.photoId,
    }),
  },
  Galleries: {
    coverPhoto: r.one.Photos({
      from: r.Galleries.coverPhotoId,
      to: r.Photos.id,
    }),
    galleryPhotos: r.many.GalleryPhotos({
      from: r.Galleries.id,
      to: r.GalleryPhotos.galleryId,
    }),
  },
  HomepagePhotos: {
    photo: r.one.Photos({
      from: r.HomepagePhotos.photoId,
      to: r.Photos.id,
      optional: false,
    }),
  },
  GalleryPhotos: {
    gallery: r.one.Galleries({
      from: r.GalleryPhotos.galleryId,
      to: r.Galleries.id,
      optional: false,
    }),
    photo: r.one.Photos({
      from: r.GalleryPhotos.photoId,
      to: r.Photos.id,
      optional: false,
    }),
  },
}));
