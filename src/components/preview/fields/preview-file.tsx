"use client";

import { useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FormField } from "@/types/form";

interface PreviewFileProps {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function PreviewFile({ field, value, onChange }: PreviewFileProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileName = typeof value === "string" ? value : null;

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file.name);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onChange(file.name);
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={field.accept}
        onChange={handleChange}
        className="hidden"
      />

      {!fileName ? (
        <button
          type="button"
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input p-6 text-muted-foreground transition-colors hover:border-ring hover:bg-muted/50"
        >
          <Upload className="size-8" />
          <span className="text-sm font-medium">Click or drag to upload</span>
          {field.accept && (
            <span className="text-xs">Accepted: {field.accept}</span>
          )}
        </button>
      ) : (
        <div className="flex items-center justify-between rounded-lg border border-input px-3 py-2">
          <span className="truncate text-sm">{fileName}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={handleRemove}
          >
            <X className="size-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
