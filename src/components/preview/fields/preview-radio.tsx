"use client";

import type { FormField } from "@/types/form";

interface PreviewRadioProps {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function PreviewRadio({ field, value, onChange }: PreviewRadioProps) {
  const options = field.options ?? [];
  const selected = (value as string) ?? "";

  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-center gap-2 text-sm cursor-pointer"
        >
          <input
            type="radio"
            name={field.id}
            value={opt.value}
            checked={selected === opt.value}
            onChange={() => onChange(opt.value)}
            className="h-4 w-4 border-input accent-primary"
          />
          {opt.label}
        </label>
      ))}
      {options.length === 0 && (
        <p className="text-sm text-muted-foreground">No options configured</p>
      )}
    </div>
  );
}
