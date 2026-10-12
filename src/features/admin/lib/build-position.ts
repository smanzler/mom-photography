import { generateKeyBetween } from "fractional-indexing";

type Positioned = { id: string; position: string };

/** `items` must be sorted by position. */
export const buildPositionAfter = ({
  items,
  id,
  afterId,
}: {
  items: Positioned[];
  id: string;
  afterId: string | null;
}) => {
  const others = items.filter((item) => item.id !== id);
  const afterIndex =
    afterId === null ? -1 : others.findIndex((item) => item.id === afterId);
  if (afterId !== null && afterIndex === -1) throw new Error("Item not found");

  const previous = afterIndex === -1 ? null : others[afterIndex].position;
  const next = others.at(afterIndex + 1)?.position ?? null;

  return generateKeyBetween(previous, next);
};

/** `items` must be sorted by position. */
export const buildPositionAtEnd = (items: Positioned[]) =>
  generateKeyBetween(items.at(-1)?.position ?? null, null);
