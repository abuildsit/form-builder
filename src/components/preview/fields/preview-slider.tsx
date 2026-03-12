"use client";

import { Slider } from "@/components/ui/slider";
import type { FormField } from "@/types/form";

interface PreviewSliderProps {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function PreviewSlider({ field, value, onChange }: PreviewSliderProps) {
  const min = field.min ?? 0;
  const max = field.max ?? 100;
  const step = field.step ?? 1;
  const current = typeof value === "number" ? value : min;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <Slider
          min={min}
          max={max}
          step={step}
          value={[current]}
          onValueChange={(val) => {
            const numVal = Array.isArray(val) ? val[0] : val;
            onChange(numVal);
          }}
        />
        <span className="min-w-[3ch] text-right text-sm font-medium tabular-nums">
          {current}
        </span>
      </div>
    </div>
  );
}
