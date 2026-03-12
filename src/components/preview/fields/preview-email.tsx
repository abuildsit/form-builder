"use client";

import { Input } from "@/components/ui/input";
import type { FormField } from "@/types/form";

interface PreviewEmailProps {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function PreviewEmail({ field, value, onChange }: PreviewEmailProps) {
  return (
    <Input
      type="email"
      placeholder={field.placeholder}
      value={(value as string) ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
