import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { PricingPackageFields } from "@/features/admin/pricing/lib/pricing-package-schema";
import { createPricingPackage } from "@/features/admin/pricing/server/create-pricing-package";
import { deletePricingPackage } from "@/features/admin/pricing/server/delete-pricing-package";
import { updatePricingPackage } from "@/features/admin/pricing/server/update-pricing-package";

export type PricingPackage = PricingPackageFields & { id: string };

/** Creates a package when `pricingPackage` is not set. */
export function PricingPackageDialog({
  pricingPackage,
  onClose,
}: {
  pricingPackage?: PricingPackage;
  onClose: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(pricingPackage?.name ?? "");
  const [price, setPrice] = useState(pricingPackage?.price ?? "");
  const [description, setDescription] = useState(
    pricingPackage?.description ?? "",
  );
  const [features, setFeatures] = useState(
    pricingPackage?.features.join("\n") ?? "",
  );
  const [isHighlighted, setIsHighlighted] = useState(
    pricingPackage?.isHighlighted ?? false,
  );
  const [isPending, setIsPending] = useState(false);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    const fields = {
      name,
      price,
      description: description.trim() || null,
      features: features
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      isHighlighted,
    };
    await (pricingPackage
      ? updatePricingPackage({ data: { id: pricingPackage.id, ...fields } })
      : createPricingPackage({ data: fields }));
    await router.invalidate();
    onClose();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;

    setIsPending(true);
    await deletePricingPackage({ data: { id } });
    await router.invalidate();
    onClose();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {pricingPackage ? "Edit package" : "New package"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                required
                placeholder="Families"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                required
                placeholder="From $350"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Short description</Label>
            <Input
              id="description"
              placeholder="For families with little ones"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="features">What's included</Label>
            <Textarea
              id="features"
              rows={4}
              placeholder={"1 hour session\n40 edited photos\nOnline gallery"}
              value={features}
              onChange={(event) => setFeatures(event.target.value)}
            />
            <p className="text-muted-foreground text-sm">One item per line.</p>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="highlighted"
              checked={isHighlighted}
              onCheckedChange={setIsHighlighted}
            />
            <Label htmlFor="highlighted">Highlight this package</Label>
          </div>
          <DialogFooter>
            {pricingPackage && (
              <Button
                type="button"
                variant="destructive"
                className="sm:mr-auto"
                disabled={isPending}
                onClick={() => handleDelete(pricingPackage.id)}
              >
                Delete
              </Button>
            )}
            <Button type="submit" disabled={isPending}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
