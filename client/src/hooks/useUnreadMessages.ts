import { useState, useEffect, useCallback } from "react";
import { api } from "../api/axios";

export function useUnreadMessages() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = useCallback(() => setRefreshTrigger((t) => t + 1), []);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { data } = await api.get("/chats/conversations");
        const conversations = data.conversations ?? [];
        const total = conversations.reduce(
          (sum: number, c: { unreadCount?: number }) => sum + (c.unreadCount ?? 0),
          0
        );
        setUnreadCount(total);
      } catch {
        setUnreadCount(0);
      }
    };

    fetchUnread();

    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [refreshTrigger]);

  return { unreadCount, refresh };
}
