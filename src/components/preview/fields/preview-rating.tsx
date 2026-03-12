"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import type { FormField } from "@/types/form";

interface PreviewRatingProps {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function PreviewRating({ field, value, onChange }: PreviewRatingProps) {
  const maxRating = field.maxRating ?? 5;
  const current = typeof value === "number" ? value : 0;
  const [hovered, setHovered] = useState<number | null>(null);

  const display = hovered ?? current;

  return (
    <div
      className="flex gap-1"
      onMouseLeave={() => setHovered(null)}
    >
      {Array.from({ length: maxRating }, (_, i) => {
        const starIndex = i + 1;
        const filled = starIndex <= display;

        return (
          <button
            key={starIndex}
            type="button"
            className="p-0.5 transition-colors focus:outline-none"
            onMouseEnter={() => setHovered(starIndex)}
            onClick={() => onChange(starIndex)}
          >
            <Star
              className={
                filled
                  ? "size-6 text-yellow-400 fill-yellow-400"
                  : "size-6 text-muted-foreground"
              }
            />
          </button>
        );
      })}
    </div>
  );
}
