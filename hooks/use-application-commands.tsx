import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCommandPaletteContext } from "@/components/command-palette/command-palette-provider";
import { Command } from "@/hooks/use-command-palette";
import {
  MessageSquare,
  LogOut,
  Plus,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { API_ENDPOINTS } from "@/lib/api-config";

interface Chat {
  id: string;
  title: string;
  created_at?: string;
}

export function useApplicationCommands() {
  const router = useRouter();
  const { user, logout, token } = useAuth();
  const { registerCommands } = useCommandPaletteContext();
  const [chats, setChats] = useState<Chat[]>([]);

  // Fetch all chats from API
  const fetchChats = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(API_ENDPOINTS.chats.list, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setChats(data || []);
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    }
  }, [token]);

  // Fetch chats on mount and when token changes
  useEffect(() => {
    if (!token) return;

    const loadChats = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.chats.list, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setChats(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    };

    loadChats();
  }, [token]);

  useEffect(() => {
    const commands: Command[] = [];

    // Chats Actions
    commands.push({
      id: "new-chat",
      title: "New Chat",
      description: "Start a new conversation",
      category: "actions",
      icon: <Plus className="h-4 w-4" />,
      onSelect: () => router.push("/chat?new=true"),
    });

    // Recent Chats from sidebar - Show at bottom
    if (chats.length > 0) {
      commands.push(
        ...chats.slice(0, 10).map((chat) => ({
          id: `chat-${chat.id}`,
          title: chat.title || "Untitled Chat",
          description: "Recent conversation",
          category: "recent" as const,
          icon: <MessageSquare className="h-4 w-4" />,
          onSelect: () => router.push(`/chat?id=${chat.id}`),
        }))
      );
    }

    // Logout action
;

    registerCommands(commands);
  }, [user, router, logout, registerCommands, chats, token]);

  return { fetchChats };
}
