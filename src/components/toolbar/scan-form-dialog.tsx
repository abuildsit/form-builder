"use client";

import { useState, useRef, useCallback } from "react";
import { useFormBuilderStore } from "@/store/form-builder-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScanLine, Upload, Loader2, CheckCircle2, XCircle } from "lucide-react";

interface ScanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

async function pdfToImages(file: File): Promise<string[]> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  const images: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    await page.render({ canvasContext: ctx, canvas, viewport }).promise;
    images.push(canvas.toDataURL("image/png"));
  }
  return images;
}

function isPdf(file: File): boolean {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
}

export function ScanFormDialog({ open, onOpenChange }: ScanFormDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [pageCount, setPageCount] = useState<number>(0);
  const [status, setStatus] = useState<
    "idle" | "converting" | "scanning" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importForm = useFormBuilderStore((s) => s.importForm);

  const handleFile = useCallback(async (f: File) => {
    setFile(f);
    setStatus("idle");
    setErrorMessage("");
    setPageCount(0);

    if (isPdf(f)) {
      try {
        setStatus("converting");
        const images = await pdfToImages(f);
        setPreviews(images);
        setPageCount(images.length);
        setStatus("idle");
      } catch (err) {
        console.error("PDF conversion error:", err);
        setStatus("error");
        setErrorMessage(
          `Failed to convert PDF: ${err instanceof Error ? err.message : "Unknown error"}. Check browser console for details.`
        );
        setPreviews([]);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPreviews([dataUrl]);
        setPageCount(1);
      };
      reader.readAsDataURL(f);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f && (f.type.startsWith("image/") || isPdf(f))) {
      handleFile(f);
    }
  };

  const handleScan = async () => {
    if (!file || previews.length === 0) return;

    setStatus("scanning");
    setErrorMessage("");

    try {
      // For images, convert file to data URL; for PDFs previews already contain data URLs
      let images: string[];
      if (isPdf(file)) {
        images = previews;
      } else {
        // previews[0] is already the data URL for image files
        images = previews;
      }

      const res = await fetch("/api/parse-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ images }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to scan form");
      }

      const success = importForm(JSON.stringify(data));
      if (success) {
        setStatus("success");
        setTimeout(() => {
          onOpenChange(false);
          setFile(null);
          setPreviews([]);
          setPageCount(0);
          setStatus("idle");
        }, 1200);
      } else {
        setStatus("error");
        setErrorMessage("Generated schema failed validation. Try a clearer image.");
      }
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setFile(null);
      setPreviews([]);
      setPageCount(0);
      setStatus("idle");
      setErrorMessage("");
    }
    onOpenChange(isOpen);
  };

  const statusText = (() => {
    if (status === "converting") return "Converting PDF...";
    if (status === "scanning" && pageCount > 1)
      return `Scanning form (${pageCount} pages)...`;
    if (status === "scanning") return "Scanning...";
    return null;
  })();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Scan Form from Image</DialogTitle>
          <DialogDescription>
            Upload an image or PDF of a form and AI will convert it into an
            editable form schema.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Form Image or PDF</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 cursor-pointer transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
              }`}
            >
              {previews.length > 0 ? (
                previews.length === 1 ? (
                  <img
                    src={previews[0]}
                    alt="Form preview"
                    className="max-h-48 rounded object-contain"
                  />
                ) : (
                  <div className="flex gap-2 overflow-x-auto max-w-full py-1">
                    {previews.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`Page ${i + 1}`}
                        className="h-36 rounded border object-contain shrink-0"
                      />
                    ))}
                  </div>
                )
              ) : status === "converting" ? (
                <>
                  <Loader2 className="h-10 w-10 text-muted-foreground/50 mb-2 animate-spin" />
                  <p className="text-sm text-muted-foreground">
                    Converting PDF...
                  </p>
                </>
              ) : (
                <>
                  <ScanLine className="h-10 w-10 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drop an image or PDF here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    PNG, JPEG, WebP, or PDF
                  </p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,.pdf,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            {file && (
              <p className="text-xs text-muted-foreground truncate">
                {file.name}
                {pageCount > 1 && (
                  <span className="ml-1 font-medium">
                    ({pageCount} pages detected)
                  </span>
                )}
              </p>
            )}
          </div>

          {status === "error" && errorMessage && (
            <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {status === "success" && (
            <div className="flex items-center gap-2 rounded-md bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Form imported successfully!</span>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleScan}
              disabled={
                previews.length === 0 ||
                status === "scanning" ||
                status === "converting"
              }
            >
              {status === "scanning" || status === "converting" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {statusText}
                </>
              ) : (
                <>
                  <ScanLine className="mr-2 h-4 w-4" />
                  Scan Form
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
