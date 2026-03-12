"use client";

import { Textarea } from "@/components/ui/textarea";
import type { FormField } from "@/types/form";

interface PreviewTextareaProps {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function PreviewTextarea({ field, value, onChange }: PreviewTextareaProps) {
  return (
    <Textarea
      placeholder={field.placeholder}
      value={(value as string) ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
