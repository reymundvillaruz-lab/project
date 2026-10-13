"use client";

import * as React from "react";
import { Sheet } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()} side="left">
      <div className="h-full w-full overflow-hidden">
        <Sidebar
          className="w-full border-none"
          onItemClick={onClose}
          isMobileDrawer={true}
        />
      </div>
    </Sheet>
  );
}
