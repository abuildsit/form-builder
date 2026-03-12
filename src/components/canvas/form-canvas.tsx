"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useFormBuilderStore } from "@/store/form-builder-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CanvasField } from "./canvas-field";
import { EmptyCanvas } from "./empty-canvas";
import { cn } from "@/lib/utils";

export function FormCanvas() {
  const fields = useFormBuilderStore((s) => s.form.fields);
  const isDragging = useFormBuilderStore((s) => s.isDragging);

  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });

  const fieldIds = fields.map((f) => f.id);

  return (
    <ScrollArea className="h-full">
      <div
        ref={setNodeRef}
        className={cn(
          "min-h-full p-6 transition-colors",
          isDragging && "bg-accent/30",
          isOver && "border-2 border-dashed border-primary rounded-lg"
        )}
      >
        {fields.length === 0 ? (
          <EmptyCanvas />
        ) : (
          <SortableContext
            items={fieldIds}
            strategy={rectSortingStrategy}
          >
            <div className="mx-auto flex max-w-2xl flex-wrap gap-y-6">
              {fields.map((field) => (
                <CanvasField key={field.id} field={field} />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </ScrollArea>
  );
}
