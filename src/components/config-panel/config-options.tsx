"use client";

import { FormField, SelectOption } from "@/types/form";
import { useFormBuilderStore } from "@/store/form-builder-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface ConfigOptionsProps {
  field: FormField;
}

export function ConfigOptions({ field }: ConfigOptionsProps) {
  const updateField = useFormBuilderStore((s) => s.updateField);
  const options = field.options ?? [];

  const setOptions = (newOptions: SelectOption[]) => {
    updateField(field.id, { options: newOptions });
  };

  const addOption = () => {
    const n = options.length + 1;
    setOptions([...options, { label: `Option ${n}`, value: `option_${n}` }]);
  };

  const updateOption = (
    index: number,
    key: keyof SelectOption,
    value: string
  ) => {
    const updated = options.map((opt, i) =>
      i === index ? { ...opt, [key]: value } : opt
    );
    setOptions(updated);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Options</h3>

      <div className="space-y-3">
        {options.map((opt, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-muted-foreground">Label</Label>
              <Input
                value={opt.label}
                onChange={(e) => updateOption(index, "label", e.target.value)}
              />
            </div>
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-muted-foreground">Value</Label>
              <Input
                value={opt.value}
                onChange={(e) => updateOption(index, "value", e.target.value)}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="mt-5 shrink-0"
              onClick={() => removeOption(index)}
            >
              <Trash2 className="size-4 text-muted-foreground" />
            </Button>
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" className="w-full" onClick={addOption}>
        <Plus className="mr-1 size-4" />
        Add Option
      </Button>
    </div>
  );
}
