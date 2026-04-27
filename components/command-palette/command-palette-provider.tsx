"use client";

import React, { createContext, useContext, ReactNode, useCallback } from "react";
import { useCommandPalette, Command } from "@/hooks/use-command-palette";
import { CommandPaletteModal } from "./command-palette-modal";

interface CommandPaletteContextType {
  registerCommands: (commands: Command[]) => void;
  openPalette: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextType | undefined>(
  undefined
);

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [commands, setCommands] = React.useState<Command[]>([]);
  const {
    isOpen,
    search,
    setSearch,
    selectedIndex,
    setSelectedIndex,
    results,
    groupedResults,
    openPalette,
    closePalette,
  } = useCommandPalette(commands);

  const registerCommands = useCallback((newCommands: Command[]) => {
    setCommands(newCommands);
  }, []);

  const contextValue: CommandPaletteContextType = {
    registerCommands,
    openPalette,
  };

  return (
    <CommandPaletteContext.Provider value={contextValue}>
      {children}
      <CommandPaletteModal
        isOpen={isOpen}
        search={search}
        onSearchChange={setSearch}
        results={results}
        selectedIndex={selectedIndex}
        onSelectIndex={setSelectedIndex}
        onClose={closePalette}
        groupedResults={groupedResults}
      />
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPaletteContext() {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error(
      "useCommandPaletteContext must be used within CommandPaletteProvider"
    );
  }
  return context;
}
