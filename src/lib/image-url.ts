const IMAGE_WIDTHS = [320, 640, 960, 1280, 1920, 2560];

const hasTransforms = () => import.meta.env.VITE_IMAGE_TRANSFORMS !== "false";

/** Uses Cloudflare Image Transformations unless `VITE_IMAGE_TRANSFORMS` is "false"; then `width` has no effect. */
export const buildImageUrl = ({
  key,
  width,
}: {
  key: string;
  width: number;
}) =>
  hasTransforms()
    ? `${import.meta.env.VITE_IMAGES_URL}/cdn-cgi/image/width=${width},quality=85,format=auto/${key}`
    : `${import.meta.env.VITE_IMAGES_URL}/${key}`;

/** Leaves out widths above the original, because transformations do not upscale. */
export const buildImageSrcSet = ({
  key,
  width,
}: {
  key: string;
  width: number;
}) =>
  (hasTransforms() ? IMAGE_WIDTHS.filter((candidate) => candidate < width) : [])
    .concat(width)
    .map(
      (candidate) =>
        `${buildImageUrl({ key, width: candidate })} ${candidate}w`,
    )
    .join(", ");
