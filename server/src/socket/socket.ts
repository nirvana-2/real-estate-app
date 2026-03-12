import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import prisma from "../utils/prisma";
import { PrismaClient } from "../utils/prisma";

export const initSocket = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: [
                "http://localhost:5173",
                "http://localhost:5174",
                process.env.CLIENT_URL,
                /\.vercel\.app$/,
            ].filter(Boolean) as (string | RegExp)[],
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        socket.on("join_room", (roomId: string) => {
            socket.join(roomId);
        });

        socket.on("send_message", async (data: {
            roomId: string;
            content: string;
            senderId: number;
            receiverId: number;
            propertyId: number;
        }) => {
            try {
                const message = await prisma.message.create({
                    data: {
                        content: data.content,
                        senderId: data.senderId,
                        receiverId: data.receiverId,
                        propertyId: data.propertyId,
                    },
                    include: {
                        sender: { select: { id: true, name: true } },
                    },
                });
                io.to(data.roomId).emit("receive_message", message);
            } catch (err) {
                console.error("Message error:", err);
            }
        });

        socket.on("disconnect", () => {
        });
    });

    return io;
};