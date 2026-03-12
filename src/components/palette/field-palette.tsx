"use client";

import { FieldType } from "@/types/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PaletteItem } from "./palette-item";

interface FieldGroup {
  title: string;
  types: FieldType[];
}

const FIELD_GROUPS: FieldGroup[] = [
  {
    title: "Layout",
    types: ["header", "divider", "content"],
  },
  {
    title: "Basic Inputs",
    types: ["text", "textarea", "number", "email", "phone", "date"],
  },
  {
    title: "Choice Fields",
    types: ["select", "multi-select", "checkbox", "radio"],
  },
  {
    title: "Advanced Fields",
    types: ["rating", "slider", "richtext", "address", "signature", "file"],
  },
];

export function FieldPalette() {
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-4 p-4">
        {FIELD_GROUPS.map((group) => (
          <Card key={group.title} size="sm">
            <CardHeader>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1.5">
                {group.types.map((type) => (
                  <PaletteItem key={type} type={type} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
