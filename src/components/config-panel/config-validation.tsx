"use client";

import { FormField, ValidationRule, FieldType } from "@/types/form";
import { useFormBuilderStore } from "@/store/form-builder-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Plus, Trash2 } from "lucide-react";

type RuleType = ValidationRule["type"];

const RULE_TYPES_BY_FIELD: Partial<Record<FieldType, RuleType[]>> = {
  text: ["minLength", "maxLength", "pattern"],
  textarea: ["minLength", "maxLength", "pattern"],
  email: ["minLength", "maxLength", "pattern"],
  phone: ["minLength", "maxLength", "pattern"],
  richtext: ["minLength", "maxLength", "pattern"],
  number: ["min", "max"],
  slider: ["min", "max"],
  file: ["maxFileSize", "fileTypes"],
};

const RULE_LABELS: Record<RuleType, string> = {
  minLength: "Min Length",
  maxLength: "Max Length",
  pattern: "Pattern",
  min: "Min Value",
  max: "Max Value",
  maxFileSize: "Max File Size",
  fileTypes: "File Types",
};

interface ConfigValidationProps {
  field: FormField;
}

export function ConfigValidation({ field }: ConfigValidationProps) {
  const updateField = useFormBuilderStore((s) => s.updateField);
  const rules = field.validation ?? [];
  const applicableRules = RULE_TYPES_BY_FIELD[field.type] ?? [];

  const existingRuleTypes = new Set(rules.map((r) => r.type));
  const availableRules = applicableRules.filter(
    (r) => !existingRuleTypes.has(r)
  );

  const setRules = (newRules: ValidationRule[]) => {
    updateField(field.id, { validation: newRules });
  };

  const addRule = (type: RuleType) => {
    setRules([...rules, { type, value: "" }]);
  };

  const updateRule = (
    index: number,
    updates: Partial<ValidationRule>
  ) => {
    const updated = rules.map((rule, i) =>
      i === index ? { ...rule, ...updates } : rule
    );
    setRules(updated);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Validation</h3>

      {applicableRules.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No validation rules available for this field type.
        </p>
      ) : (
        <>
          <div className="space-y-3">
            {rules.map((rule, index) => (
              <div
                key={index}
                className="space-y-2 rounded-md border p-3"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{RULE_LABELS[rule.type]}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() => removeRule(index)}
                  >
                    <Trash2 className="size-3.5 text-muted-foreground" />
                  </Button>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Value</Label>
                  <Input
                    value={String(rule.value)}
                    onChange={(e) =>
                      updateRule(index, { value: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Error message (optional)
                  </Label>
                  <Input
                    value={rule.message ?? ""}
                    onChange={(e) =>
                      updateRule(index, { message: e.target.value })
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          {availableRules.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="mr-1 size-4" />
                    Add Rule
                  </Button>
                }
              />
              <DropdownMenuContent>
                {availableRules.map((ruleType) => (
                  <DropdownMenuItem
                    key={ruleType}
                    onClick={() => addRule(ruleType)}
                  >
                    {RULE_LABELS[ruleType]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </>
      )}
    </div>
  );
}
