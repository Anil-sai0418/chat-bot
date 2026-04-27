import { useState, useCallback, useEffect } from "react";
import Fuse from "fuse.js";

export interface Command {
  id: string;
  title: string;
  description?: string;
  category: "pages" | "actions" | "recent";
  icon?: React.ReactNode;
  onSelect: () => void;
}

export const useCommandPalette = (commands: Command[]) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fuzzy search setup
  const fuse = new Fuse(commands, {
    keys: ["title", "description"],
    threshold: 0.3,
    minMatchCharLength: 1,
  });

  const results = search.trim() === "" ? commands : fuse.search(search).map((result: { item: Command }) => result.item);

  // Group results by category
  const groupedResults = results.reduce(
    (acc: Record<string, Command[]>, command: Command) => {
      const category = command.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(command);
      return acc;
    },
    {} as Record<string, Command[]>
  );

  const flatResults = Object.values(groupedResults).flat();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setSearch("");
        setSelectedIndex(0);
      }

      // Close with Escape
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setSearch("");
        setSelectedIndex(0);
      }

      // Navigation and selection
      if (isOpen) {
        switch (e.key) {
          case "ArrowUp":
            e.preventDefault();
            setSelectedIndex((prev) =>
              prev === 0 ? flatResults.length - 1 : prev - 1
            );
            break;
          case "ArrowDown":
            e.preventDefault();
            setSelectedIndex((prev) =>
              prev === flatResults.length - 1 ? 0 : prev + 1
            );
            break;
          case "Enter":
            e.preventDefault();
            if (flatResults[selectedIndex]) {
              const selected = flatResults[selectedIndex] as Command;
              selected.onSelect();
              setIsOpen(false);
              setSearch("");
              setSelectedIndex(0);
            }
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, flatResults]);

  const openPalette = useCallback(() => {
    setIsOpen(true);
    setSearch("");
    setSelectedIndex(0);
  }, []);

  const closePalette = useCallback(() => {
    setIsOpen(false);
    setSearch("");
    setSelectedIndex(0);
  }, []);

  return {
    isOpen,
    search,
    setSearch,
    selectedIndex,
    setSelectedIndex,
    results: flatResults,
    groupedResults,
    openPalette,
    closePalette,
  };
};
