"use client";

import type { FormField } from "@/types/form";

interface PreviewMultiSelectProps {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function PreviewMultiSelect({ field, value, onChange }: PreviewMultiSelectProps) {
  const options = field.options ?? [];
  const selected = Array.isArray(value) ? (value as string[]) : [];

  const toggle = (optValue: string) => {
    if (selected.includes(optValue)) {
      onChange(selected.filter((v) => v !== optValue));
    } else {
      onChange([...selected, optValue]);
    }
  };

  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-center gap-2 text-sm cursor-pointer"
        >
          <input
            type="checkbox"
            checked={selected.includes(opt.value)}
            onChange={() => toggle(opt.value)}
            className="h-4 w-4 rounded border-input accent-primary"
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
