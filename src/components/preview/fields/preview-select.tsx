"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FormField } from "@/types/form";

interface PreviewSelectProps {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function PreviewSelect({ field, value, onChange }: PreviewSelectProps) {
  const options = field.options ?? [];

  return (
    <Select
      value={(value as string) ?? null}
      onValueChange={(val) => onChange(val)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={field.placeholder ?? "Select an option"} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
