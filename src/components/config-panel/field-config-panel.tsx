"use client";

import { useFormBuilderStore } from "@/store/form-builder-store";
import { FieldType } from "@/types/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConfigGeneral } from "./config-general";
import { ConfigOptions } from "./config-options";
import { ConfigSlider } from "./config-slider";
import { ConfigRating } from "./config-rating";
import { ConfigFile } from "./config-file";
import { ConfigValidation } from "./config-validation";
import { ConfigClientLink } from "./config-client-link";
import { ConfigHeader } from "./config-header";
import { ConfigContent } from "./config-content";
import {
  Type,
  AlignLeft,
  Hash,
  Mail,
  Phone,
  Calendar,
  ChevronDown,
  List,
  CheckSquare,
  CircleDot,
  Star,
  SlidersHorizontal,
  FileText,
  MapPin,
  Pen,
  Upload,
  Heading,
  Minus,
  Pilcrow,
} from "lucide-react";

const FIELD_TYPE_ICONS: Record<FieldType, React.ElementType> = {
  text: Type,
  textarea: AlignLeft,
  number: Hash,
  email: Mail,
  phone: Phone,
  date: Calendar,
  select: ChevronDown,
  "multi-select": List,
  checkbox: CheckSquare,
  radio: CircleDot,
  rating: Star,
  slider: SlidersHorizontal,
  richtext: FileText,
  address: MapPin,
  signature: Pen,
  file: Upload,
  header: Heading,
  divider: Minus,
  content: Pilcrow,
};

const LAYOUT_TYPES = new Set(["header", "divider", "content"]);

const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: "Text",
  textarea: "Textarea",
  number: "Number",
  email: "Email",
  phone: "Phone",
  date: "Date",
  select: "Select",
  "multi-select": "Multi-Select",
  checkbox: "Checkbox",
  radio: "Radio",
  rating: "Rating",
  slider: "Slider",
  richtext: "Rich Text",
  address: "Address",
  signature: "Signature",
  file: "File",
  header: "Header",
  divider: "Divider",
  content: "Content",
};

const OPTIONS_TYPES = new Set<FieldType>([
  "select",
  "multi-select",
  "radio",
  "checkbox",
]);

export function FieldConfigPanel() {
  const selectedFieldId = useFormBuilderStore((s) => s.selectedFieldId);
  const fields = useFormBuilderStore((s) => s.form.fields);

  const field = selectedFieldId
    ? fields.find((f) => f.id === selectedFieldId)
    : null;

  if (!field) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">
          Select a field to configure
        </p>
      </div>
    );
  }

  const Icon = FIELD_TYPE_ICONS[field.type];

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
            <Icon className="size-4 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {FIELD_TYPE_LABELS[field.type]}
              </Badge>
            </div>
            <p className="mt-0.5 truncate text-sm font-medium">
              {field.label}
            </p>
          </div>
        </div>

        <Separator />

        {/* General (not for divider) */}
        {field.type !== "divider" && <ConfigGeneral field={field} />}

        {/* Divider: no config */}
        {field.type === "divider" && (
          <p className="text-sm text-muted-foreground">
            Dividers have no configuration.
          </p>
        )}

        {/* Header settings */}
        {field.type === "header" && (
          <>
            <Separator />
            <ConfigHeader field={field} />
          </>
        )}

        {/* Content settings */}
        {field.type === "content" && (
          <>
            <Separator />
            <ConfigContent field={field} />
          </>
        )}

        {/* Options (conditional) */}
        {OPTIONS_TYPES.has(field.type) && (
          <>
            <Separator />
            <ConfigOptions field={field} />
          </>
        )}

        {/* Slider (conditional) */}
        {field.type === "slider" && (
          <>
            <Separator />
            <ConfigSlider field={field} />
          </>
        )}

        {/* Rating (conditional) */}
        {field.type === "rating" && (
          <>
            <Separator />
            <ConfigRating field={field} />
          </>
        )}

        {/* File (conditional) */}
        {field.type === "file" && (
          <>
            <Separator />
            <ConfigFile field={field} />
          </>
        )}

        {/* Validation & Client Link: only for non-layout types */}
        {!LAYOUT_TYPES.has(field.type) && (
          <>
            <Separator />
            <ConfigValidation field={field} />

            <Separator />
            <ConfigClientLink field={field} />
          </>
        )}
      </div>
    </ScrollArea>
  );
}
