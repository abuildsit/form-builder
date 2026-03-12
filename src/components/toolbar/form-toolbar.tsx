"use client";

import { useState, useRef } from "react";
import { useFormBuilderStore } from "@/store/form-builder-store";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FolderOpen, Sun, Moon, Eye, ScanLine, FilePlus, Sparkles } from "lucide-react";
import { FullPreviewDialog } from "@/components/preview/full-preview-dialog";
import { ScanFormDialog } from "./scan-form-dialog";
import { GenerateFormDialog } from "./generate-form-dialog";
import { FormSchema } from "@/types/form";
import onboarding from "@/../samples/client-onboarding.json";
import feedback from "@/../samples/client-feedback.json";

export function FormToolbar() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);

  const formTitle = useFormBuilderStore((s) => s.form.title);
  const setFormTitle = useFormBuilderStore((s) => s.setFormTitle);
  const loadSampleForm = useFormBuilderStore((s) => s.loadSampleForm);
  const resetForm = useFormBuilderStore((s) => s.resetForm);

  const { theme, setTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    }
  };

  const handleTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value) {
      setFormTitle(value);
    }
  };

  return (
    <>
      <div className="h-14 border-b px-4 flex items-center justify-between shrink-0">
        <Input
          ref={inputRef}
          defaultValue={formTitle}
          key={formTitle}
          onBlur={handleTitleBlur}
          onKeyDown={handleTitleKeyDown}
          className="max-w-xs border-transparent text-lg font-semibold focus:border-input"
        />

        <div className="flex gap-2">
          <Button
            variant="default"
            size="lg"
            className="text-base font-semibold px-6"
            onClick={() => setPreviewOpen(true)}
          >
            <Eye className="mr-2 h-5 w-5" />
            Preview
          </Button>

          <Button variant="outline" onClick={resetForm}>
            <FilePlus className="mr-2 h-4 w-4" />
            New Form
          </Button>

          <Button variant="outline" onClick={() => setScanOpen(true)}>
            <ScanLine className="mr-2 h-4 w-4" />
            Scan Form
          </Button>

          <Button variant="outline" onClick={() => setGenerateOpen(true)}>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground cursor-pointer">
              <FolderOpen className="h-4 w-4" />
              Load Sample
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  loadSampleForm(onboarding as unknown as FormSchema)
                }
              >
                Client Onboarding
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  loadSampleForm(feedback as unknown as FormSchema)
                }
              >
                Client Feedback
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>

      <ScanFormDialog open={scanOpen} onOpenChange={setScanOpen} />
      <GenerateFormDialog open={generateOpen} onOpenChange={setGenerateOpen} />
      <FullPreviewDialog open={previewOpen} onOpenChange={setPreviewOpen} />
    </>
  );
}
