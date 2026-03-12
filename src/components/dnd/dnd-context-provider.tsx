"use client";

import { useState, type ReactNode } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useFormBuilderStore } from "@/store/form-builder-store";
import { FIELD_ICONS } from "@/lib/field-icons";
import { FieldType } from "@/types/form";
import { getPaletteLabel } from "@/components/palette/palette-item";
import { PreviewField } from "@/components/preview/preview-field";

export function DndContextProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<FieldType | null>(null);
  const [activeOrigin, setActiveOrigin] = useState<string | null>(null);

  const setDragging = useFormBuilderStore((s) => s.setDragging);
  const addField = useFormBuilderStore((s) => s.addField);
  const reorderFields = useFormBuilderStore((s) => s.reorderFields);
  const fields = useFormBuilderStore((s) => s.form.fields);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveType(active.data.current?.type ?? null);
    setActiveOrigin(active.data.current?.origin ?? null);
    setDragging(true);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setDragging(false);
    setActiveId(null);
    setActiveType(null);
    setActiveOrigin(null);

    if (!over) return;

    const origin = active.data.current?.origin;

    if (origin === "palette") {
      const type = active.data.current?.type as FieldType;
      // Insert at the position of the field being hovered over
      const overIndex = fields.findIndex((f) => f.id === over.id);
      if (overIndex !== -1) {
        addField(type, overIndex + 1);
      } else {
        addField(type);
      }
    } else if (origin === "canvas") {
      const activeIndex = fields.findIndex((f) => f.id === active.id);
      const overIndex = fields.findIndex((f) => f.id === over.id);
      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        reorderFields(activeIndex, overIndex);
      }
    }
  }

  const ActiveIcon = activeType ? FIELD_ICONS[activeType] : null;
  const activeField =
    activeOrigin === "canvas"
      ? fields.find((f) => f.id === activeId)
      : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay>
        {activeId && activeOrigin === "canvas" && activeField ? (
          <div className="rounded-lg border bg-card p-3 shadow-lg opacity-90 pointer-events-none max-w-md">
            <PreviewField field={activeField} />
          </div>
        ) : activeId && ActiveIcon && activeType ? (
          <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 shadow-lg">
            <ActiveIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {getPaletteLabel(activeType)}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
