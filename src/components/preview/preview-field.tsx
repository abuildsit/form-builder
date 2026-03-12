"use client";

import { useFormBuilderStore } from "@/store/form-builder-store";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { FormField } from "@/types/form";

import { PreviewText } from "./fields/preview-text";
import { PreviewTextarea } from "./fields/preview-textarea";
import { PreviewNumber } from "./fields/preview-number";
import { PreviewEmail } from "./fields/preview-email";
import { PreviewPhone } from "./fields/preview-phone";
import { PreviewDate } from "./fields/preview-date";
import { PreviewSelect } from "./fields/preview-select";
import { PreviewMultiSelect } from "./fields/preview-multi-select";
import { PreviewCheckbox } from "./fields/preview-checkbox";
import { PreviewRadio } from "./fields/preview-radio";
import { PreviewRating } from "./fields/preview-rating";
import { PreviewSlider } from "./fields/preview-slider";
import { PreviewRichtext } from "./fields/preview-richtext";
import { PreviewAddress } from "./fields/preview-address";
import { PreviewSignature } from "./fields/preview-signature";
import { PreviewFile } from "./fields/preview-file";
import { PreviewHeader } from "./fields/preview-header";
import { PreviewDivider } from "./fields/preview-divider";
import { PreviewContent } from "./fields/preview-content";

interface PreviewFieldProps {
  field: FormField;
}

const LAYOUT_TYPES = new Set(["header", "divider", "content"]);

export function PreviewField({ field }: PreviewFieldProps) {
  const previewValues = useFormBuilderStore((s) => s.previewValues);
  const setPreviewValue = useFormBuilderStore((s) => s.setPreviewValue);

  const value = previewValues[field.id];
  const onChange = (val: unknown) => setPreviewValue(field.id, val);

  // Layout types render directly without label/help text wrapper
  if (LAYOUT_TYPES.has(field.type)) {
    switch (field.type) {
      case "header":
        return <PreviewHeader field={field} />;
      case "divider":
        return <PreviewDivider />;
      case "content":
        return <PreviewContent field={field} />;
    }
  }

  const showLabel = field.type !== "checkbox" || (field.options && field.options.length > 0);

  const renderField = () => {
    const props = { field, value, onChange };

    switch (field.type) {
      case "text":
        return <PreviewText {...props} />;
      case "textarea":
        return <PreviewTextarea {...props} />;
      case "number":
        return <PreviewNumber {...props} />;
      case "email":
        return <PreviewEmail {...props} />;
      case "phone":
        return <PreviewPhone {...props} />;
      case "date":
        return <PreviewDate {...props} />;
      case "select":
        return <PreviewSelect {...props} />;
      case "multi-select":
        return <PreviewMultiSelect {...props} />;
      case "checkbox":
        return <PreviewCheckbox {...props} />;
      case "radio":
        return <PreviewRadio {...props} />;
      case "rating":
        return <PreviewRating {...props} />;
      case "slider":
        return <PreviewSlider {...props} />;
      case "richtext":
        return <PreviewRichtext {...props} />;
      case "address":
        return <PreviewAddress {...props} />;
      case "signature":
        return <PreviewSignature {...props} />;
      case "file":
        return <PreviewFile {...props} />;
      default:
        return <p className="text-sm text-muted-foreground">Unsupported field type</p>;
    }
  };

  return (
    <div className="space-y-1.5">
      {showLabel && (
        <Label>
          {field.label}
          {field.required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
      )}

      {field.linkedField && (
        <Badge variant="secondary" className="text-xs">
          {field.linkedField.direction === "read"
            ? "Pre-populated from client"
            : "Updates client record"}
        </Badge>
      )}

      {renderField()}

      {field.helpText && (
        <p className="text-sm text-muted-foreground">{field.helpText}</p>
      )}
    </div>
  );
}
