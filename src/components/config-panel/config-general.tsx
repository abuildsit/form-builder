"use client";

import { FormField } from "@/types/form";
import { useFormBuilderStore } from "@/store/form-builder-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HIDE_PLACEHOLDER_TYPES = new Set([
  "signature",
  "file",
  "address",
  "checkbox",
  "radio",
]);
const HIDE_DEFAULT_VALUE_TYPES = new Set(["signature", "file", "address", "header", "divider", "content"]);
const LAYOUT_TYPES = new Set(["header", "divider", "content"]);

interface ConfigGeneralProps {
  field: FormField;
}

export function ConfigGeneral({ field }: ConfigGeneralProps) {
  const updateField = useFormBuilderStore((s) => s.updateField);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">General</h3>

      <div className="space-y-2">
        <Label htmlFor="field-label">Label *</Label>
        <Input
          id="field-label"
          value={field.label}
          onChange={(e) => updateField(field.id, { label: e.target.value })}
        />
      </div>

      {!HIDE_PLACEHOLDER_TYPES.has(field.type) && !LAYOUT_TYPES.has(field.type) && (
        <div className="space-y-2">
          <Label htmlFor="field-placeholder">Placeholder</Label>
          <Input
            id="field-placeholder"
            value={field.placeholder ?? ""}
            onChange={(e) =>
              updateField(field.id, { placeholder: e.target.value })
            }
          />
        </div>
      )}

      {!LAYOUT_TYPES.has(field.type) && (
        <div className="space-y-2">
          <Label htmlFor="field-help-text">Help text</Label>
          <Input
            id="field-help-text"
            value={field.helpText ?? ""}
            onChange={(e) => updateField(field.id, { helpText: e.target.value })}
          />
        </div>
      )}

      {!LAYOUT_TYPES.has(field.type) && (
        <div className="flex items-center justify-between">
          <Label htmlFor="field-required">Required</Label>
          <Switch
            id="field-required"
            checked={field.required}
            onCheckedChange={(checked) =>
              updateField(field.id, { required: checked })
            }
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="field-width">Width</Label>
        <Select
          value={field.width ?? "full"}
          onValueChange={(val) =>
            updateField(field.id, { width: val as "full" | "half" })
          }
        >
          <SelectTrigger id="field-width" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full">Full Width</SelectItem>
            <SelectItem value="half">Half Width</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!HIDE_DEFAULT_VALUE_TYPES.has(field.type) && (
        <div className="space-y-2">
          <Label htmlFor="field-default">Default value</Label>
          <Input
            id="field-default"
            value={String(field.defaultValue ?? "")}
            onChange={(e) =>
              updateField(field.id, { defaultValue: e.target.value })
            }
          />
        </div>
      )}
    </div>
  );
}
