import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../api/axios";
import socket from "../../services/socket";
import {
  MessageSquare,
  Send,
  Loader2,
  ArrowLeft,
  Home,
  Trash2,
} from "lucide-react";

interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId?: number;
  propertyId?: number;
  sender: { id: number; name: string };
  createdAt: string;
}

interface Conversation {
  propertyId: number;
  property: { id: number; title: string };
  otherUser: { id: number; name: string };
  landlord?: { id: number; name: string };
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

function getRoomId(propertyId: number, senderId: number, receiverId: number): string {
  return `property_${propertyId}_${Math.min(senderId, receiverId)}_${Math.max(senderId, receiverId)}`;
}

function getRoomIdFromMessage(msg: Message): string | null {
  const propId = msg.propertyId ?? 0;
  const s = msg.senderId;
  const r = msg.receiverId ?? 0;
  if (!propId || !s || !r) return null;
  return `property_${propId}_${Math.min(s, r)}_${Math.max(s, r)}`;
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messagesByRoom, setMessagesByRoom] = useState<Record<string, Message[]>>({});
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const senderId = user?.id ?? 0;

  const getDisplayName = (conv: Conversation) =>
    user?.role === "TENANT" && conv.landlord ? conv.landlord.name : conv.otherUser.name;

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await api.get("/chats/conversations");
        setConversations(data.conversations ?? []);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!selectedConversation || !user) return;

    const receiverId = selectedConversation.otherUser.id;
    const propertyId = selectedConversation.propertyId;
    const roomId = getRoomId(propertyId, senderId, receiverId);

    const joinRoom = () => socket.emit("join_room", roomId);
    joinRoom();

    const onConnect = () => joinRoom();
    socket.on("connect", onConnect);

    const fetchMessages = async () => {
      setMessagesLoading((prev) => ({ ...prev, [roomId]: true }));
      try {
        const { data } = await api.get(`/chats/${propertyId}/${receiverId}`);
        const msgs = data.messages ?? [];
        setMessagesByRoom((prev) => ({ ...prev, [roomId]: msgs }));
        await api.patch(`/chats/${propertyId}/${receiverId}/read`);
        setConversations((prev) =>
          prev.map((c) =>
            c.propertyId === propertyId && c.otherUser.id === receiverId
              ? { ...c, unreadCount: 0 }
              : c
          )
        );
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setMessagesLoading((prev) => ({ ...prev, [roomId]: false }));
      }
    };

    if (!(roomId in messagesByRoom)) {
      fetchMessages();
    } else {
      api.patch(`/chats/${propertyId}/${receiverId}/read`).catch(() => {});
      setConversations((prev) =>
        prev.map((c) =>
          c.propertyId === propertyId && c.otherUser.id === receiverId
            ? { ...c, unreadCount: 0 }
            : c
        )
      );
    }

    return () => {
      socket.off("connect", onConnect);
    };
  }, [selectedConversation, user, senderId]);

  const currentRoomId = selectedConversation
    ? getRoomId(
        selectedConversation.propertyId,
        senderId,
        selectedConversation.otherUser.id
      )
    : null;
  const currentMessages = currentRoomId ? (messagesByRoom[currentRoomId] ?? []) : [];
  const isLoadingMessages = currentRoomId ? (messagesLoading[currentRoomId] ?? false) : false;

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !user) return;

    const receiverId = selectedConversation.otherUser.id;
    const propertyId = selectedConversation.propertyId;
    const roomId = getRoomId(propertyId, senderId, receiverId);

    socket.emit("send_message", {
      roomId,
      content: newMessage.trim(),
      senderId,
      receiverId,
      propertyId,
    });

    setNewMessage("");
  };

  const handleDeleteConversation = async (propertyId: number, otherUserId: number) => {
    if (!window.confirm("Are you sure you want to delete this conversation? This action cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/chats/${propertyId}/${otherUserId}`);
      setConversations(prev => prev.filter(c => !(c.propertyId === propertyId && c.otherUser.id === otherUserId)));
      if (selectedConversation?.propertyId === propertyId && selectedConversation?.otherUser.id === otherUserId) {
        setSelectedConversation(null);
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      alert("Failed to delete conversation. Please try again.");
    }
  };

  const selectedConvRef = useRef(selectedConversation);
  selectedConvRef.current = selectedConversation;

  useEffect(() => {
    const handleNewMessage = (msg: Message) => {
      const msgRoomId = getRoomIdFromMessage(msg);
      if (msgRoomId) {
        setMessagesByRoom((prev) => {
          const existing = prev[msgRoomId] ?? [];
          if (existing.some((m) => m.id === msg.id)) return prev;
          return { ...prev, [msgRoomId]: [...existing, msg] };
        });
      }

      const otherUserId = msg.senderId === user?.id ? msg.receiverId : msg.senderId;
      const propId = msg.propertyId;
      if (!otherUserId || !propId) return;

      const isViewingThisConversation =
        selectedConvRef.current &&
        selectedConvRef.current.propertyId === propId &&
        selectedConvRef.current.otherUser.id === otherUserId;

      setConversations((prev) => {
        const convKey = `${propId}-${otherUserId}`;
        const existing = prev.find(
          (c) => `${c.propertyId}-${c.otherUser.id}` === convKey
        );
        if (existing) {
          return prev.map((c) =>
            `${c.propertyId}-${c.otherUser.id}` === convKey
              ? {
                  ...c,
                  lastMessage: msg.content,
                  lastMessageAt: msg.createdAt,
                  unreadCount:
                    msg.receiverId === user?.id && !isViewingThisConversation
                      ? c.unreadCount + 1
                      : c.unreadCount,
                }
              : c
          );
        }
        return prev;
      });
    };

    socket.on("receive_message", handleNewMessage);
    return () => {
      socket.off("receive_message", handleNewMessage);
    };
  }, [user?.id]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Messages</h1>
          <p className="text-slate-500 font-medium mt-1">
            {user?.role === "LANDLORD"
              ? "Chat with tenants about your properties."
              : "Your conversations with landlords about properties."}
          </p>
        </div>

        <div className="card overflow-hidden border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row min-h-[500px]">
            {/* Conversations list */}
            <div
              className={`md:w-80 border-b md:border-b-0 md:border-r border-slate-200 bg-white ${
                selectedConversation ? "hidden md:block" : ""
              }`}
            >
              {loading ? (
                <div className="p-8 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#e51013]" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 font-medium">
                    No conversations yet.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Tenants will appear here when they message you.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 overflow-y-auto max-h-[500px]">
                  {conversations.map((conv) => (
                    <button
                      key={`${conv.propertyId}-${conv.otherUser.id}`}
                      onClick={() => setSelectedConversation(conv)}
                      className={`w-full p-4 text-left hover:bg-slate-50 transition-colors flex items-start gap-3 ${
                        selectedConversation?.propertyId === conv.propertyId &&
                        selectedConversation?.otherUser.id === conv.otherUser.id
                          ? "bg-red-50 border-l-4 border-[#e51013]"
                          : ""
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#e51013]/10 text-[#e51013] flex items-center justify-center font-bold flex-shrink-0">
                        {getDisplayName(conv).charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate">
                          {getDisplayName(conv)}
                        </p>
                        <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                          <Home className="w-3 h-3 flex-shrink-0" />
                          {conv.property.title}
                        </p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {conv.lastMessage}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="flex-shrink-0 w-5 h-5 bg-[#e51013] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col bg-slate-50/50 min-h-[400px] h-[500px]">
              {selectedConversation ? (
                <>
                  <div className="bg-white border-b border-slate-200 p-4 flex items-center gap-3 flex-shrink-0">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
                    >
                      <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-[#e51013]/10 text-[#e51013] flex items-center justify-center font-bold">
                      {getDisplayName(selectedConversation).charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900">
                        {getDisplayName(selectedConversation)}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Home className="w-3 h-3" />
                        {selectedConversation.property.title}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleDeleteConversation(
                          selectedConversation.propertyId,
                          selectedConversation.otherUser.id
                        )
                      }
                      className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                      title="Delete Conversation"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                    {isLoadingMessages ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-[#e51013]" />
                      </div>
                    ) : currentMessages.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-sm text-slate-500">
                          No messages yet. Start the conversation!
                        </p>
                      </div>
                    ) : (
                      currentMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.senderId === user.id ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-2xl text-sm break-words overflow-hidden ${
                              msg.senderId === user.id
                                ? "bg-[#e51013] text-white rounded-tr-none"
                                : "bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none"
                            }`}
                          >
                            <p className="break-words">{msg.content}</p>
                            <span className="text-[9px] opacity-70 mt-1 block">
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={scrollRef} />
                  </div>

                  <form
                    onSubmit={handleSend}
                    className="p-4 bg-white border-t border-slate-200 flex-shrink-0"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#e51013]/20 focus:border-[#e51013] resize-none h-10"
                      />
                      <button
                        type="submit"
                        className="bg-[#e51013] text-white px-5 py-2.5 rounded-xl hover:bg-[#c40e10] transition-colors flex-shrink-0"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
                  <MessageSquare className="w-16 h-16 mb-4" />
                  <p className="font-medium text-slate-500">Select a conversation</p>
                  <p className="text-sm mt-1">
                    Choose a tenant from the list to view and reply to messages.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
