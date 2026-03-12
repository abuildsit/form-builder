"use client";

import { Input } from "@/components/ui/input";
import type { FormField } from "@/types/form";

interface PreviewTextProps {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function PreviewText({ field, value, onChange }: PreviewTextProps) {
  return (
    <Input
      type="text"
      placeholder={field.placeholder}
      value={(value as string) ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
