"use client";

import { FormField } from "@/types/form";
import { useFormBuilderStore } from "@/store/form-builder-store";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ConfigContentProps {
  field: FormField;
}

export function ConfigContent({ field }: ConfigContentProps) {
  const updateField = useFormBuilderStore((s) => s.updateField);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Content Settings</h3>

      <div className="space-y-2">
        <Label htmlFor="content-text">Content Text</Label>
        <Textarea
          id="content-text"
          rows={6}
          value={field.content ?? ""}
          onChange={(e) => updateField(field.id, { content: e.target.value })}
          placeholder="Enter descriptive content or instructions..."
        />
      </div>
    </div>
  );
}
