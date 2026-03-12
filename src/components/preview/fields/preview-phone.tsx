"use client";

import { Input } from "@/components/ui/input";
import type { FormField } from "@/types/form";

interface PreviewPhoneProps {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function PreviewPhone({ field, value, onChange }: PreviewPhoneProps) {
  return (
    <Input
      type="tel"
      placeholder={field.placeholder}
      value={(value as string) ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
