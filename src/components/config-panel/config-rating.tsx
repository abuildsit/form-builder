"use client";

import { FormField } from "@/types/form";
import { useFormBuilderStore } from "@/store/form-builder-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConfigRatingProps {
  field: FormField;
}

export function ConfigRating({ field }: ConfigRatingProps) {
  const updateField = useFormBuilderStore((s) => s.updateField);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Rating Settings</h3>

      <div className="space-y-2">
        <Label htmlFor="max-rating">Max Rating (1-10)</Label>
        <Input
          id="max-rating"
          type="number"
          min={1}
          max={10}
          value={field.maxRating ?? 5}
          onChange={(e) => {
            const val = Math.min(10, Math.max(1, Number(e.target.value)));
            updateField(field.id, { maxRating: val });
          }}
        />
      </div>
    </div>
  );
}
