/** Returns the new order and the id the moved item now follows, or `undefined` when nothing moved. */
export const findMovedOrder = <T extends { id: string }>({
  items,
  activeId,
  overId,
}: {
  items: T[];
  activeId: string;
  overId: string;
}) => {
  const from = items.findIndex((item) => item.id === activeId);
  const to = items.findIndex((item) => item.id === overId);
  if (from === -1 || to === -1 || from === to) return undefined;

  const without = items.filter((item) => item.id !== activeId);
  const order = [...without.slice(0, to), items[from], ...without.slice(to)];
  const afterId = to === 0 ? null : order[to - 1].id;

  return { order, afterId };
};
