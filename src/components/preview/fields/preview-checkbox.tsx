"use client";

import type { FormField } from "@/types/form";

interface PreviewCheckboxProps {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function PreviewCheckbox({ field, value, onChange }: PreviewCheckboxProps) {
  const hasOptions = field.options && field.options.length > 0;

  if (hasOptions) {
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
        {field.options!.map((opt) => (
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
      </div>
    );
  }

  const checked = typeof value === "boolean" ? value : false;

  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-input accent-primary"
      />
      {field.label}
    </label>
  );
}
