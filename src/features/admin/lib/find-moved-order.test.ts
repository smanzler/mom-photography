import { describe, expect, it } from "vitest";
import { findMovedOrder } from "@/features/admin/lib/find-moved-order";

const items = ["a", "b", "c", "d"].map((id) => ({ id }));
const idsOf = (result: ReturnType<typeof findMovedOrder>) =>
  result?.order.map((item) => item.id);

describe("findMovedOrder", () => {
  it("moves an item down", () => {
    const result = findMovedOrder({ items, activeId: "a", overId: "c" });
    expect(idsOf(result)).toEqual(["b", "c", "a", "d"]);
    expect(result?.afterId).toBe("c");
  });

  it("moves an item up", () => {
    const result = findMovedOrder({ items, activeId: "d", overId: "b" });
    expect(idsOf(result)).toEqual(["a", "d", "b", "c"]);
    expect(result?.afterId).toBe("a");
  });

  it("moves an item to the start", () => {
    const result = findMovedOrder({ items, activeId: "c", overId: "a" });
    expect(idsOf(result)).toEqual(["c", "a", "b", "d"]);
    expect(result?.afterId).toBeNull();
  });

  it("returns undefined when the item did not move", () => {
    expect(
      findMovedOrder({ items, activeId: "b", overId: "b" }),
    ).toBeUndefined();
  });
});
