"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormField } from "@/types/form";

interface AddressValue {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface PreviewAddressProps {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
}

const emptyAddress: AddressValue = {
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
};

export function PreviewAddress({ value, onChange }: PreviewAddressProps) {
  const addr: AddressValue =
    value && typeof value === "object"
      ? { ...emptyAddress, ...(value as AddressValue) }
      : { ...emptyAddress };

  const update = (key: keyof AddressValue, val: string) => {
    onChange({ ...addr, [key]: val });
  };

  return (
    <div className="space-y-3">
      <div>
        <Label className="mb-1.5">Street</Label>
        <Input
          placeholder="Street address"
          value={addr.street}
          onChange={(e) => update("street", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-4 gap-3">
        <div className="col-span-2">
          <Label className="mb-1.5">City</Label>
          <Input
            placeholder="City"
            value={addr.city}
            onChange={(e) => update("city", e.target.value)}
          />
        </div>
        <div>
          <Label className="mb-1.5">State</Label>
          <Input
            placeholder="State"
            value={addr.state}
            onChange={(e) => update("state", e.target.value)}
          />
        </div>
        <div>
          <Label className="mb-1.5">Zip</Label>
          <Input
            placeholder="Zip"
            value={addr.zip}
            onChange={(e) => update("zip", e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label className="mb-1.5">Country</Label>
        <Input
          placeholder="Country"
          value={addr.country}
          onChange={(e) => update("country", e.target.value)}
        />
      </div>
    </div>
  );
}
