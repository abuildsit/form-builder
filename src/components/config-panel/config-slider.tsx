"use client";

import { FormField } from "@/types/form";
import { useFormBuilderStore } from "@/store/form-builder-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConfigSliderProps {
  field: FormField;
}

export function ConfigSlider({ field }: ConfigSliderProps) {
  const updateField = useFormBuilderStore((s) => s.updateField);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Slider Settings</h3>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label htmlFor="slider-min">Min</Label>
          <Input
            id="slider-min"
            type="number"
            value={field.min ?? 0}
            onChange={(e) =>
              updateField(field.id, { min: Number(e.target.value) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slider-max">Max</Label>
          <Input
            id="slider-max"
            type="number"
            value={field.max ?? 100}
            onChange={(e) =>
              updateField(field.id, { max: Number(e.target.value) })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slider-step">Step</Label>
          <Input
            id="slider-step"
            type="number"
            value={field.step ?? 1}
            onChange={(e) =>
              updateField(field.id, { step: Number(e.target.value) })
            }
          />
        </div>
      </div>
    </div>
  );
}
