"use client";

import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCommandPaletteContext } from "./command-palette-provider";

export function CommandPaletteSearchButton() {
  const { openPalette } = useCommandPaletteContext();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={openPalette}
      className="hidden md:inline-flex relative h-9 w-full max-w-xs items-center justify-start rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground shadow-none transition-colors hover:bg-muted hover:text-foreground md:w-40 lg:w-64"
    >
      <Search className="mr-2 h-4 w-4" />
      <span className="hidden lg:inline-flex">Search...</span>
      <span className="inline-flex lg:hidden">Search...</span>
      <kbd className="pointer-events-none absolute right-1.5 hidden h-6 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
}
