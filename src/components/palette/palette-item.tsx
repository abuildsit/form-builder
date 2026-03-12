"use client";

import { useDraggable } from "@dnd-kit/core";
import { FieldType } from "@/types/form";
import { FIELD_ICONS } from "@/lib/field-icons";
import { cn } from "@/lib/utils";

const FIELD_LABELS: Record<FieldType, string> = {
  text: "Text",
  textarea: "Text Area",
  number: "Number",
  email: "Email",
  phone: "Phone",
  date: "Date",
  select: "Dropdown",
  "multi-select": "Multi Select",
  checkbox: "Checkbox",
  radio: "Radio",
  rating: "Rating",
  slider: "Slider",
  richtext: "Rich Text",
  address: "Address",
  signature: "Signature",
  file: "File Upload",
  header: "Header",
  divider: "Divider",
  content: "Content",
};

export function getPaletteLabel(type: FieldType): string {
  return FIELD_LABELS[type];
}

export function PaletteItem({ type }: { type: FieldType }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type, origin: "palette" },
  });

  const Icon = FIELD_ICONS[type];

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex w-full items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-grab active:cursor-grabbing",
        isDragging && "opacity-40"
      )}
    >
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span>{FIELD_LABELS[type]}</span>
    </button>
  );
}
