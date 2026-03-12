"use client";

import type { FormField } from "@/types/form";

interface PreviewContentProps {
  field: FormField;
}

export function PreviewContent({ field }: PreviewContentProps) {
  return (
    <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
      {field.content || "No content provided."}
    </div>
  );
}
