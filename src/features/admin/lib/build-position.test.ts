import { generateNKeysBetween } from "fractional-indexing";
import { describe, expect, it } from "vitest";
import {
  buildPositionAfter,
  buildPositionAtEnd,
} from "@/features/admin/lib/build-position";

const [a, b, c] = generateNKeysBetween(null, null, 3);
const items = [
  { id: "a", position: a },
  { id: "b", position: b },
  { id: "c", position: c },
];

describe("buildPositionAfter", () => {
  it("puts an item between two others", () => {
    const position = buildPositionAfter({ items, id: "c", afterId: "a" });
    expect(position > a && position < b).toBe(true);
  });

  it("puts an item first", () => {
    expect(buildPositionAfter({ items, id: "c", afterId: null }) < a).toBe(
      true,
    );
  });

  it("puts an item last", () => {
    expect(buildPositionAfter({ items, id: "a", afterId: "c" }) > c).toBe(true);
  });

  it("throws when afterId is not in the list", () => {
    expect(() =>
      buildPositionAfter({ items, id: "a", afterId: "x" }),
    ).toThrow();
  });
});

describe("buildPositionAtEnd", () => {
  it("starts an empty list", () => {
    expect(buildPositionAtEnd([])).toBe(generateNKeysBetween(null, null, 1)[0]);
  });

  it("goes after the last item", () => {
    expect(buildPositionAtEnd(items) > c).toBe(true);
  });
});
