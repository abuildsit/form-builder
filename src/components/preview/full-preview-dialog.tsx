"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FormPreview } from "@/components/preview/form-preview";

interface FullPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FullPreviewDialog({ open, onOpenChange }: FullPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Form Preview</DialogTitle>
          <DialogDescription>
            Full preview of how your form will appear to respondents.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto min-h-0">
          <FormPreview />
        </div>
      </DialogContent>
    </Dialog>
  );
}
