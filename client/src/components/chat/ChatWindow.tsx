import React, { useEffect, useState, useRef } from "react";
import { Send, X, MessageSquare, Loader2 } from "lucide-react";
import socket from "../../services/socket";
import { api } from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";

interface Message {
  id: number;
  content: string;
  senderId: number;
  sender: { name: string };
  createdAt: string;
}

interface ChatWindowProps {
  propertyId: number;
  landlordId: number;
  propertyTitle: string;
  landlordName?: string;
  onClose: () => void;
}

function getRoomId(propertyId: number, senderId: number, receiverId: number): string {
  return `property_${propertyId}_${Math.min(senderId, receiverId)}_${Math.max(senderId, receiverId)}`;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  propertyId,
  landlordId,
  propertyTitle,
  landlordName,
  onClose,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const senderId = user?.id ?? 0;
  const receiverId = landlordId;
  const roomId = getRoomId(propertyId, senderId, receiverId);

  useEffect(() => {
    if (!user) return;

    const joinRoom = () => socket.emit("join_room", roomId);
    joinRoom();

    const onConnect = () => joinRoom();
    socket.on("connect", onConnect);

    const fetchHistory = async () => {
      try {
        const { data } = await api.get(`/chats/${propertyId}/${receiverId}`);
        setMessages(data.messages ?? []);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();

    const handleReceiveMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [user, propertyId, receiverId, roomId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    socket.emit("send_message", {
      roomId,
      content: newMessage.trim(),
      senderId,
      receiverId,
      propertyId,
    });

    setNewMessage("");
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-50 animate-in fade-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="bg-slate-900 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-[#e51013]" />
          </div>
          <div>
            <h4 className="font-bold text-sm truncate max-w-[150px]">{propertyTitle}</h4>
            <p className="text-[10px] text-slate-400">
              {landlordName ? `Chat with ${landlordName}` : "Direct Chat with Landlord"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 min-h-0">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xs text-slate-400">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm break-words overflow-hidden ${
                  msg.senderId === user?.id
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

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="p-4 bg-white border-t border-slate-100 flex gap-2 flex-shrink-0"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#e51013]/20 focus:border-[#e51013] transition-all resize-none h-9"
        />
        <button
          type="submit"
          className="bg-[#e51013] text-white p-2.5 rounded-xl hover:bg-[#c40e10] transition-colors shadow-lg shadow-red-500/20 flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
