"use client";

import { FormToolbar } from "@/components/toolbar/form-toolbar";
import { FieldPalette } from "@/components/palette/field-palette";
import { FormCanvas } from "@/components/canvas/form-canvas";
import { FieldConfigPanel } from "@/components/config-panel/field-config-panel";
import { FormPreview } from "@/components/preview/form-preview";
import { DndContextProvider } from "@/components/dnd/dnd-context-provider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function AppLayout() {
  return (
    <DndContextProvider>
      <div className="h-screen flex flex-col bg-background">
        <FormToolbar />
        <div className="flex-1 grid grid-cols-[280px_1fr_360px] overflow-hidden">
          <div className="border-r overflow-hidden">
            <FieldPalette />
          </div>
          <div className="overflow-hidden">
            <FormCanvas />
          </div>
          <div className="border-l overflow-hidden flex flex-col">
            <Tabs defaultValue="configure" className="flex flex-col h-full overflow-hidden">
              <TabsList className="w-full shrink-0">
                <TabsTrigger value="configure" className="flex-1">
                  Configure
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex-1">
                  Preview
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="configure"
                className="flex-1 overflow-y-auto mt-0"
              >
                <FieldConfigPanel />
              </TabsContent>
              <TabsContent
                value="preview"
                className="flex-1 overflow-y-auto mt-0"
              >
                <FormPreview />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DndContextProvider>
  );
}
