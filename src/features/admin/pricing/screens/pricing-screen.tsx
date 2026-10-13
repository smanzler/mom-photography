import { verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SortableList } from "@/features/admin/components/sortable-list";
import { PricingPackageDialog } from "@/features/admin/pricing/components/pricing-package-dialog";
import type { PricingPackage } from "@/features/admin/pricing/components/pricing-package-dialog";
import { movePricingPackage } from "@/features/admin/pricing/server/move-pricing-package";

type Editing =
  { kind: "new" } | { kind: "edit"; pricingPackage: PricingPackage };

export function PricingScreen({ packages }: { packages: PricingPackage[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Editing>();

  const handleMove = async (move: { id: string; afterId: string | null }) => {
    await movePricingPackage({ data: move });
    await router.invalidate();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Pricing</h1>
          <p className="text-muted-foreground text-sm">
            These packages show on the homepage, in this order. Visitors pick
            one in the contact form.
          </p>
        </div>
        <Button
          variant="outline"
          className="ml-auto"
          onClick={() => setEditing({ kind: "new" })}
        >
          <Plus />
          Add package
        </Button>
      </div>

      {packages.length === 0 ? (
        <p className="text-muted-foreground">No packages yet.</p>
      ) : (
        <SortableList
          items={packages}
          strategy={verticalListSortingStrategy}
          className="divide-border border-border flex flex-col divide-y rounded-md border"
          onMove={handleMove}
          renderItem={(pricingPackage, handle) => (
            <div className="bg-background flex items-center gap-3 p-3">
              {handle}
              <button
                type="button"
                className="font-medium hover:underline"
                onClick={() => setEditing({ kind: "edit", pricingPackage })}
              >
                {pricingPackage.name}
              </button>
              <span className="text-muted-foreground text-sm">
                {pricingPackage.price}
              </span>
              {pricingPackage.isHighlighted && (
                <Badge className="ml-auto">Highlighted</Badge>
              )}
            </div>
          )}
        />
      )}

      {editing && (
        <PricingPackageDialog
          pricingPackage={
            editing.kind === "edit" ? editing.pricingPackage : undefined
          }
          onClose={() => setEditing(undefined)}
        />
      )}
    </div>
  );
}
