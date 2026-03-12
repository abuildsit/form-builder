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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, CheckCircle2, XCircle } from "lucide-react";

interface GenerateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EXAMPLE_PROMPTS = [
  "Employee onboarding checklist with personal info, emergency contacts, and IT setup",
  "Event registration form with ticket selection, dietary requirements, and accessibility needs",
  "Vendor assessment form with company details, compliance checks, and performance ratings",
];

export function GenerateFormDialog({
  open,
  onOpenChange,
}: GenerateFormDialogProps) {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<
    "idle" | "generating" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const importForm = useFormBuilderStore((s) => s.importForm);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setStatus("generating");
    setErrorMessage("");

    try {
      const res = await fetch("/api/generate-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate form");
      }

      const success = importForm(JSON.stringify(data));
      if (success) {
        setStatus("success");
        setTimeout(() => {
          onOpenChange(false);
          setPrompt("");
          setStatus("idle");
        }, 1200);
      } else {
        setStatus("error");
        setErrorMessage(
          "Generated schema failed validation. Try a more detailed description."
        );
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
      setPrompt("");
      setStatus("idle");
      setErrorMessage("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Generate Form</DialogTitle>
          <DialogDescription>
            Describe the form you want and AI will create it for you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gen-prompt">Form Description</Label>
            <Textarea
              id="gen-prompt"
              rows={5}
              placeholder="Describe the form you want... e.g., 'A customer satisfaction survey with sections for service quality, product feedback, and a net promoter score'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="space-y-1.5 pt-1">
              <p className="text-xs text-muted-foreground font-medium">Try an example:</p>
              {EXAMPLE_PROMPTS.map((example) => (
                <button
                  key={example}
                  type="button"
                  className="block w-full text-left text-xs text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded-md px-3 py-2 transition-colors cursor-pointer"
                  onClick={() => setPrompt(example)}
                >
                  {example}
                </button>
              ))}
            </div>
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
              <span>Form generated successfully!</span>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || status === "generating"}
            >
              {status === "generating" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
