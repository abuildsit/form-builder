"use client";

import { MousePointerClick } from "lucide-react";

export function EmptyCanvas() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="flex max-w-sm flex-col items-center gap-4 rounded-xl border-2 border-dashed border-muted-foreground/25 p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <MousePointerClick className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            Drag fields from the palette to start building your form
          </p>
        </div>
      </div>
    </div>
  );
}
