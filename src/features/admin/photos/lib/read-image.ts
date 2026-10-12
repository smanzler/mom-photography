const PLACEHOLDER_WIDTH = 16;

/** Reads the size after EXIF rotation, and makes a tiny blurred-looking placeholder. */
export const readImage = async (file: File) => {
  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;

  const canvas = document.createElement("canvas");
  canvas.width = PLACEHOLDER_WIDTH;
  canvas.height = Math.max(1, Math.round((height / width) * PLACEHOLDER_WIDTH));
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return { width, height, placeholder: canvas.toDataURL("image/webp", 0.6) };
};
