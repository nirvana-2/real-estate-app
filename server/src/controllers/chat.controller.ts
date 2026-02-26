import { Request, Response } from "express";
import prisma from "../utils/prisma";

const fetchConversation = async (userId: number, propertyId: number, otherUserId: number) => {
  return prisma.message.findMany({
    where: {
      propertyId,
      OR: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { id: true, name: true } },
    },
  });
};

export const getConversation = async (req: any, res: Response) => {
  const { otherUserId, propertyId } = req.query;
  const userId = req.user.id;

  try {
    const messages = await fetchConversation(userId, Number(propertyId), Number(otherUserId));
    res.json({ messages });
  } catch (error) {
    console.error("Get conversation error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export const getConversationByPath = async (req: any, res: Response) => {
  const { propertyId, otherUserId } = req.params;
  const userId = req.user.id;

  try {
    const messages = await fetchConversation(userId, Number(propertyId), Number(otherUserId));
    res.json({ messages });
  } catch (error) {
    console.error("Get conversation error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export const markConversationAsRead = async (req: any, res: Response) => {
  const { propertyId, otherUserId } = req.params;
  const userId = req.user.id;

  try {
    await prisma.message.updateMany({
      where: {
        propertyId: Number(propertyId),
        senderId: Number(otherUserId),
        receiverId: userId,
        isRead: false,
      },
      data: { isRead: true },
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Mark read error:", error);
    res.status(500).json({ message: "Failed to mark as read" });
  }
};

export const getMyConversations = async (req: any, res: Response) => {
  const userId = req.user.id;

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        property: { include: { landlord: { select: { id: true, name: true } } } },
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const conversationsMap = new Map<
      string,
      {
        propertyId: number;
        property: { id: number; title: string; landlord?: { id: number; name: string } };
        otherUser: { id: number; name: string };
        landlord: { id: number; name: string };
        lastMessage: string;
        lastMessageAt: Date;
        unreadCount: number;
      }
    >();

    messages.forEach((msg) => {
      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
      const landlord = msg.property.landlord;
      const key = `${msg.propertyId}-${otherUser.id}`;

      if (!conversationsMap.has(key)) {
        conversationsMap.set(key, {
          propertyId: msg.propertyId,
          property: msg.property,
          otherUser,
          landlord: landlord ?? otherUser,
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt,
          unreadCount: !msg.isRead && msg.receiverId === userId ? 1 : 0,
        });
      } else {
        const conv = conversationsMap.get(key)!;
        if (!msg.isRead && msg.receiverId === userId) {
          conv.unreadCount += 1;
        }
      }
    });

    res.json({ conversations: Array.from(conversationsMap.values()) });
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
};

export const deleteConversation = async (req: any, res: Response) => {
  const { propertyId, otherUserId } = req.params;
  const userId = req.user.id;

  try {
    await prisma.message.deleteMany({
      where: {
        propertyId: Number(propertyId),
        OR: [
          { senderId: userId, receiverId: Number(otherUserId) },
          { senderId: Number(otherUserId), receiverId: userId },
        ],
      },
    });
    res.json({ success: true, message: "Conversation deleted" });
  } catch (error) {
    console.error("Delete conversation error:", error);
    res.status(500).json({ message: "Failed to delete conversation" });
  }
};

