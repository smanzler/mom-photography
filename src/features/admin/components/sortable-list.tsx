import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import type { SortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useId, useState } from "react";
import type { ReactNode } from "react";
import { findMovedOrder } from "@/features/admin/lib/find-moved-order";
import { cn } from "@/lib/utils";

/**
 * Shows `items` in the new order at once, then calls `onMove`.
 * The caller must refresh `items` after `onMove`; a new `items` array resets the local order.
 */
export function SortableList<T extends { id: string }>({
  items,
  strategy,
  className,
  onMove,
  renderItem,
}: {
  items: T[];
  strategy: SortingStrategy;
  className?: string;
  onMove: (move: { id: string; afterId: string | null }) => Promise<void>;
  renderItem: (item: T, handle: ReactNode) => ReactNode;
}) {
  // dnd-kit makes its own ids from a counter, which differ between the server and the client render.
  const dndId = useId();
  const [moved, setMoved] = useState<{ source: T[]; order: T[] }>();
  const order = moved?.source === items ? moved.order : items;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over) return;

    const result = findMovedOrder({
      items: order,
      activeId: String(active.id),
      overId: String(over.id),
    });
    if (!result) return;

    setMoved({ source: items, order: result.order });
    await onMove({ id: String(active.id), afterId: result.afterId });
  };

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={order} strategy={strategy}>
        <ul className={className}>
          {order.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              {(handle) => renderItem(item, handle)}
            </SortableItem>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({
  id,
  children,
}: {
  id: string;
  children: (handle: ReactNode) => ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const handle = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      className="text-muted-foreground hover:text-foreground cursor-grab touch-none rounded p-1"
      aria-label="Drag to reorder"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="size-4" />
    </button>
  );

  return (
    <li
      ref={setNodeRef}
      // dnd-kit computes the transform on every pointer move.
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(isDragging && "relative z-10 opacity-80")}
    >
      {children(handle)}
    </li>
  );
}
