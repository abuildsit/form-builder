"use client";

import { Bold, Italic, List } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import type { FormField } from "@/types/form";

interface PreviewRichtextProps {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function PreviewRichtext({ field, value, onChange }: PreviewRichtextProps) {
  return (
    <div className="space-y-0">
      <div className="flex items-center gap-1 rounded-t-lg border border-b-0 border-input bg-muted/50 px-2 py-1.5">
        <button
          type="button"
          disabled
          className="rounded p-1 text-muted-foreground opacity-60"
        >
          <Bold className="size-4" />
        </button>
        <button
          type="button"
          disabled
          className="rounded p-1 text-muted-foreground opacity-60"
        >
          <Italic className="size-4" />
        </button>
        <button
          type="button"
          disabled
          className="rounded p-1 text-muted-foreground opacity-60"
        >
          <List className="size-4" />
        </button>
      </div>
      <Textarea
        placeholder={field.placeholder ?? "Enter rich text content..."}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[120px] rounded-t-none"
      />
    </div>
  );
}
