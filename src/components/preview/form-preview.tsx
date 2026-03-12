"use client";

import { useFormBuilderStore } from "@/store/form-builder-store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PreviewField } from "./preview-field";

export function FormPreview() {
  const form = useFormBuilderStore((s) => s.form);
  const clients = useFormBuilderStore((s) => s.clients);
  const selectedClientId = useFormBuilderStore((s) => s.selectedClientId);
  const selectClient = useFormBuilderStore((s) => s.selectClient);

  return (
    <Card className="bg-muted/50 h-full">
      <ScrollArea className="h-full">
        <CardHeader className="border-b pb-4">
          <h2 className="text-lg font-semibold">{form.title || "Untitled Form"}</h2>
          {form.description && (
            <p className="text-sm text-muted-foreground">{form.description}</p>
          )}
          <div className="mt-3">
            <label className="mb-1.5 block text-sm font-medium">Client</label>
            <Select
              value={selectedClientId ?? "__none__"}
              onValueChange={(val) => {
                selectClient(val === "__none__" ? null : (val as string));
              }}
            >
              <SelectTrigger className="w-full">
                <span>
                  {selectedClientId
                    ? clients.find((c) => c.id === selectedClientId)?.name ?? "Unknown"
                    : "No client selected"}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">No client selected</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="py-6">
          {form.fields.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Add fields to see a live preview
            </p>
          ) : (
            <div className="flex flex-wrap gap-y-6">
              {form.fields.map((field) => (
                <div
                  key={field.id}
                  className={
                    field.width === "half"
                      ? "w-1/2 px-1.5"
                      : "w-full"
                  }
                >
                  <PreviewField field={field} />
                </div>
              ))}
            </div>
          )}

          {form.fields.length > 0 && (
            <div className="pt-4">
              <Button disabled className="w-full">
                Submit
              </Button>
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
