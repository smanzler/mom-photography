import { describe, expect, it, vi } from "vitest";
import { buildImageSrcSet } from "@/lib/image-url";

vi.stubEnv("VITE_IMAGES_URL", "https://images.test");

const widthsOf = (srcSet: string) =>
  srcSet.split(", ").map((entry) => entry.split(" ")[1]);

describe("buildImageSrcSet", () => {
  it("stops at the original width", () => {
    expect(
      widthsOf(buildImageSrcSet({ key: "photos/a", width: 1000 })),
    ).toEqual(["320w", "640w", "960w", "1000w"]);
  });

  it("does not repeat a width that is also the original width", () => {
    expect(widthsOf(buildImageSrcSet({ key: "photos/a", width: 640 }))).toEqual(
      ["320w", "640w"],
    );
  });

  it("builds transformation URLs", () => {
    expect(buildImageSrcSet({ key: "photos/a", width: 200 })).toBe(
      "https://images.test/cdn-cgi/image/width=200,quality=85,format=auto/photos/a 200w",
    );
  });
});
