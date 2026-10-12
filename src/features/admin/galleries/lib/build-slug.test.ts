import { describe, expect, it } from "vitest";
import {
  findFreeSlug,
  toSlug,
} from "@/features/admin/galleries/lib/build-slug";

describe("toSlug", () => {
  it("makes a URL-safe slug", () => {
    expect(toSlug("  Summer in Côte d'Azur! ")).toBe("summer-in-cote-d-azur");
  });

  it("returns an empty string when no letters or digits are left", () => {
    expect(toSlug("!!!")).toBe("");
  });
});

describe("findFreeSlug", () => {
  it("keeps the base when it is free", () => {
    expect(findFreeSlug("weddings", ["portraits"])).toBe("weddings");
  });

  it("finds the first free suffix", () => {
    expect(
      findFreeSlug("weddings", ["weddings", "weddings-2", "weddings-4"]),
    ).toBe("weddings-3");
  });
});
