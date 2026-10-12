export const toSlug = (title: string) =>
  title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Adds `-2`, `-3`, … to `base` until the result is not in `taken`. */
export const findFreeSlug = (base: string, taken: string[]) => {
  const takenSet = new Set(taken);
  if (!takenSet.has(base)) return base;

  const suffix = Array.from({ length: taken.length + 1 }, (_, i) => i + 2).find(
    (n) => !takenSet.has(`${base}-${n}`),
  );
  return `${base}-${suffix}`;
};
