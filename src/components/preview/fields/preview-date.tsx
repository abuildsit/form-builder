"use client";

import { Input } from "@/components/ui/input";
import type { FormField } from "@/types/form";

interface PreviewDateProps {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function PreviewDate({ field, value, onChange }: PreviewDateProps) {
  const dateValue = value
    ? String(value).slice(0, 10)
    : "";

  return (
    <Input
      type="date"
      placeholder={field.placeholder}
      value={dateValue}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
