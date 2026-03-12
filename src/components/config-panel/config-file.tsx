"use client";

import { FormField } from "@/types/form";
import { useFormBuilderStore } from "@/store/form-builder-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConfigFileProps {
  field: FormField;
}

export function ConfigFile({ field }: ConfigFileProps) {
  const updateField = useFormBuilderStore((s) => s.updateField);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">File Settings</h3>

      <div className="space-y-2">
        <Label htmlFor="file-accept">Accepted file types</Label>
        <Input
          id="file-accept"
          placeholder=".pdf,.doc,.png"
          value={field.accept ?? ""}
          onChange={(e) => updateField(field.id, { accept: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Comma-separated file extensions (e.g. .pdf,.doc,.png)
        </p>
      </div>
    </div>
  );
}
