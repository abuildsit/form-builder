"use client";

import { useState } from "react";
import { useFormBuilderStore } from "@/store/form-builder-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Download, Check } from "lucide-react";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
  const [copied, setCopied] = useState(false);
  const exportForm = useFormBuilderStore((s) => s.exportForm);
  const jsonOutput = exportForm();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonOutput], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "form-schema.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Export Form JSON</DialogTitle>
          <DialogDescription>
            Copy or download the current form schema as JSON.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <pre className="max-h-96 overflow-auto rounded-md bg-muted p-4 text-sm font-mono whitespace-pre-wrap">
            {jsonOutput}
          </pre>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download .json
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
