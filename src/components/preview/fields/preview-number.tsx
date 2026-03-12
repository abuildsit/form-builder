"use client";

import { Input } from "@/components/ui/input";
import type { FormField } from "@/types/form";

interface PreviewNumberProps {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function PreviewNumber({ field, value, onChange }: PreviewNumberProps) {
  return (
    <Input
      type="number"
      placeholder={field.placeholder}
      value={value != null ? String(value) : ""}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === "") {
          onChange(undefined);
        } else {
          const num = parseFloat(raw);
          onChange(isNaN(num) ? undefined : num);
        }
      }}
    />
  );
}
