import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

// Load environment variables from .env
dotenv.config();

// Import routes (note the `.route.ts` naming)
import propertyRoutes from "./routes/property.route";
import bookingRoutes from "./routes/booking.route";
import favoriteRoutes from "./routes/favorite.route";
import applicationRoutes from "./routes/application.route";
import userRoutes from "./routes/user.route";
import landlordRoutes from "./routes/landlord.route";
import tenantRoutes from "./routes/tenants.route";
import paymentRoutes from "./routes/payment.route";
import adminRoutes from "./routes/admin.route";
import authRoutes from "./routes/auth.route";
import chatRoutes from "./routes/chat.route";
import agentRoutes from "./routes/agent.route";
import { createServer } from "http";
import { initSocket } from "./socket/socket";

const app = express();
const server = createServer(app);

// Initialize Socket.io
initSocket(server);

// Middleware
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5174",
      "http://localhost:5173",
      "http://127.0.0.1:5174",
      "http://127.0.0.1:5173",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

// Static folder for uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/properties", propertyRoutes);
app.use("/bookings", bookingRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/applications", applicationRoutes);
app.use("/users", userRoutes);
app.use("/landlords", landlordRoutes);
app.use("/tenants", tenantRoutes);
app.use("/payments", paymentRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/chats", chatRoutes);
app.use("/api/agents", agentRoutes);

// Health check
app.get("/", (_req, res: any) => {
  res.send("Server is running 🚀");
});

// Error handling middleware
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  res.status(status).json({ message });
});

// Start server
const PORT = process.env.PORT || 3005;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
