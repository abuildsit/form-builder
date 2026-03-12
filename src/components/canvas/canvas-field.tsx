"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FormField } from "@/types/form";
import { useFormBuilderStore } from "@/store/form-builder-store";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { PreviewField } from "@/components/preview/preview-field";

export function CanvasField({ field }: { field: FormField }) {
  const [isHovered, setIsHovered] = useState(false);

  const selectedFieldId = useFormBuilderStore((s) => s.selectedFieldId);
  const selectField = useFormBuilderStore((s) => s.selectField);
  const removeField = useFormBuilderStore((s) => s.removeField);
  const duplicateField = useFormBuilderStore((s) => s.duplicateField);

  const isSelected = selectedFieldId === field.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: field.id,
    data: { origin: "canvas", type: field.type },
  });

  const style = {
    transform: CSS.Transform.toString(
      transform ? { ...transform, x: 0 } : null
    ),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        field.width === "half" ? "w-1/2 px-1.5" : "w-full"
      )}
      onClick={() => selectField(field.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "group relative rounded-lg border bg-card p-3 transition-all",
          isSelected && "ring-2 ring-primary border-primary",
          !isSelected && "hover:border-muted-foreground/30",
          isDragging && "opacity-50"
        )}
      >
        {/* Floating toolbar */}
        {(isHovered || isSelected) && !isDragging && (
          <div className="absolute -top-3 right-2 z-10 flex items-center gap-0.5 rounded-md border bg-card px-1 py-0.5 shadow-sm">
            <button
              className="cursor-grab rounded p-1 text-muted-foreground hover:text-foreground active:cursor-grabbing"
              {...listeners}
            >
              <GripVertical className="h-3.5 w-3.5" />
            </button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                duplicateField(field.id);
              }}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                removeField(field.id);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {/* Preview content - visual only */}
        <div className="pointer-events-none">
          <PreviewField field={field} />
        </div>
      </div>
    </div>
  );
}
