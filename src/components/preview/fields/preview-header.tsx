"use client";

import type { FormField } from "@/types/form";

interface PreviewHeaderProps {
  field: FormField;
}

export function PreviewHeader({ field }: PreviewHeaderProps) {
  const level = field.headingLevel ?? 2;
  const className =
    level === 1
      ? "text-2xl font-bold"
      : level === 2
        ? "text-xl font-semibold"
        : "text-lg font-medium";

  if (level === 1) return <h1 className={className}>{field.label}</h1>;
  if (level === 3) return <h3 className={className}>{field.label}</h3>;
  return <h2 className={className}>{field.label}</h2>;
}
