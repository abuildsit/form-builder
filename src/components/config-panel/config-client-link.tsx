"use client";

import { FormField, ClientFieldKey, LinkDirection } from "@/types/form";
import { useFormBuilderStore } from "@/store/form-builder-store";
import {
  getCompatibleClientFields,
  CLIENT_FIELD_LABELS,
} from "@/lib/field-compatibility";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Unlink } from "lucide-react";

interface ConfigClientLinkProps {
  field: FormField;
}

export function ConfigClientLink({ field }: ConfigClientLinkProps) {
  const updateField = useFormBuilderStore((s) => s.updateField);
  const compatibleFields = getCompatibleClientFields(field.type);

  const currentSource = field.linkedField?.source;
  const currentKey = currentSource
    ? (currentSource.replace("client.", "") as ClientFieldKey)
    : null;
  const currentDirection = field.linkedField?.direction ?? "read";

  const handleFieldSelect = (value: ClientFieldKey) => {
    updateField(field.id, {
      linkedField: {
        source: `client.${value}`,
        direction: currentDirection,
      },
    });
  };

  const handleDirectionChange = (values: string[]) => {
    const direction = values[0] as LinkDirection | undefined;
    if (direction && currentKey) {
      updateField(field.id, {
        linkedField: {
          source: `client.${currentKey}`,
          direction,
        },
      });
    }
  };

  const handleRemoveLink = () => {
    updateField(field.id, { linkedField: undefined });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">
        Client Data Link
      </h3>

      {compatibleFields.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No compatible client fields for this type.
        </p>
      ) : (
        <>
          <div className="space-y-2">
            <Label>Client field</Label>
            <Select
              value={currentKey ?? undefined}
              onValueChange={(val) => handleFieldSelect(val as ClientFieldKey)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a client field" />
              </SelectTrigger>
              <SelectContent>
                {compatibleFields.map((key) => (
                  <SelectItem key={key} value={key}>
                    {CLIENT_FIELD_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currentKey && (
            <>
              <div className="space-y-2">
                <Label>Direction</Label>
                <ToggleGroup
                  value={[currentDirection]}
                  onValueChange={handleDirectionChange}
                  variant="outline"
                  className="w-full"
                >
                  <ToggleGroupItem
                    value="read"
                    className="flex-1 text-xs"
                  >
                    Read (pre-populate)
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="write"
                    className="flex-1 text-xs"
                  >
                    Write (update)
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full text-destructive"
                onClick={handleRemoveLink}
              >
                <Unlink className="mr-1 size-4" />
                Remove Link
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
}
