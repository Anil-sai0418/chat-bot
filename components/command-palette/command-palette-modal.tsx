"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Command } from "@/hooks/use-command-palette";
import { cn } from "@/lib/utils";

interface CommandPaletteModalProps {
  isOpen: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  results: Command[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onClose: () => void;
  groupedResults: Record<string, Command[]>;
}

const categoryLabels: Record<string, string> = {
  pages: "Pages",
  actions: "Chats",
  recent: "Recent",
};

export function CommandPaletteModal({
  isOpen,
  search,
  onSearchChange,
  results,
  selectedIndex,
  onSelectIndex,
  onClose,
  groupedResults,
}: CommandPaletteModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll to selected item
  useEffect(() => {
    if (scrollRef.current && results.length > 0) {
      const selectedElement = scrollRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex, results]);

  const showEmptyState = results.length === 0 && search.trim() !== "";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="rounded-lg border border-border bg-background shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="border-b border-border/50 px-4 py-3 sm:py-4">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                  <Input
                    ref={inputRef}
                    placeholder="Search pages, actions, and more..."
                    value={search}
                    onChange={(e) => {
                      onSearchChange(e.target.value);
                      onSelectIndex(0);
                    }}
                    className="border-0 bg-transparent p-0 text-base placeholder-muted-foreground/60 focus-visible:ring-0"
                  />
                  {search && (
                    <button
                      onClick={() => {
                        onSearchChange("");
                        onSelectIndex(0);
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Results List */}
              <ScrollArea className="max-h-96" ref={scrollRef}>
                {showEmptyState ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-muted-foreground">
                      No results found for &ldquo;{search}&rdquo;
                    </p>
                  </div>
                ) : results.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Start typing to search...
                    </p>
                  </div>
                ) : (
                  <div className="py-2">
                    {Object.entries(groupedResults).map(([category, items]) => (
                      items.length > 0 && (
                        <div key={category}>
                          <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {categoryLabels[category] || category}
                          </div>
                          {items.map((command) => {
                            const globalIndex = results.indexOf(command);
                            return (
                              <CommandPaletteItem
                                key={command.id}
                                command={command}
                                isSelected={globalIndex === selectedIndex}
                                onClick={() => {
                                  command.onSelect();
                                  onClose();
                                }}
                                onMouseEnter={() =>
                                  onSelectIndex(globalIndex)
                                }
                                data-index={globalIndex}
                              />
                            );
                          })}
                        </div>
                      )
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Footer with keyboard hints */}
              {results.length > 0 && (
                <div className="border-t border-border/50 bg-muted/30 px-4 py-2 text-xs text-muted-foreground flex items-center justify-between">
                  <span>{results.length} result(s)</span>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                      <kbd className="rounded border border-border/50 bg-background px-2 py-0.5 text-xs font-semibold">
                        ↑
                      </kbd>
                      <kbd className="rounded border border-border/50 bg-background px-2 py-0.5 text-xs font-semibold">
                        ↓
                      </kbd>
                      <span>Navigate</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="rounded border border-border/50 bg-background px-2 py-0.5 text-xs font-semibold">
                        ↵
                      </kbd>
                      <span>Select</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="rounded border border-border/50 bg-background px-2 py-0.5 text-xs font-semibold">
                        Esc
                      </kbd>
                      <span>Close</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface CommandPaletteItemProps {
  command: Command;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

function CommandPaletteItem({
  command,
  isSelected,
  onClick,
  onMouseEnter,
  ...props
}: CommandPaletteItemProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={cn(
        "cursor-pointer px-4 py-2.5 transition-colors",
        isSelected
          ? "bg-primary/10 border-l-2 border-primary pl-3"
          : "border-l-2 border-transparent"
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        {command.icon && (
          <div className="shrink-0 text-muted-foreground">
            {command.icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-foreground truncate">
            {command.title}
          </div>
          {command.description && (
            <div className="text-xs text-muted-foreground truncate">
              {command.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
