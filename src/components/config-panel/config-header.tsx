"use client";

import { FormField } from "@/types/form";
import { useFormBuilderStore } from "@/store/form-builder-store";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ConfigHeaderProps {
  field: FormField;
}

export function ConfigHeader({ field }: ConfigHeaderProps) {
  const updateField = useFormBuilderStore((s) => s.updateField);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Heading Settings</h3>

      <div className="space-y-2">
        <Label htmlFor="heading-level">Heading Level</Label>
        <Select
          value={String(field.headingLevel ?? 2)}
          onValueChange={(val) =>
            updateField(field.id, { headingLevel: Number(val) as 1 | 2 | 3 })
          }
        >
          <SelectTrigger id="heading-level" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">H1 - Large</SelectItem>
            <SelectItem value="2">H2 - Medium</SelectItem>
            <SelectItem value="3">H3 - Small</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
