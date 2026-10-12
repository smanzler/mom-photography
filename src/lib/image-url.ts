const IMAGE_WIDTHS = [320, 640, 960, 1280, 1920, 2560];

/** Uses Cloudflare Image Transformations, so `VITE_IMAGES_URL` must be a zone with transformations on. */
export const buildImageUrl = ({ key, width }: { key: string; width: number }) =>
  `${import.meta.env.VITE_IMAGES_URL}/cdn-cgi/image/width=${width},quality=85,format=auto/${key}`;

/** Leaves out widths above the original, because transformations do not upscale. */
export const buildImageSrcSet = ({
  key,
  width,
}: {
  key: string;
  width: number;
}) =>
  IMAGE_WIDTHS.filter((candidate) => candidate < width)
    .concat(width)
    .map(
      (candidate) =>
        `${buildImageUrl({ key, width: candidate })} ${candidate}w`,
    )
    .join(", ");
