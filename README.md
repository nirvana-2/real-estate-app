# Hamro Real-Estate 🏠

A modern, full-stack Real Estate SaaS platform built with visual excellence and a premium user experience. This application facilitates seamless connections between Tenants, Landlords, and Agents, featuring real-time communication, map-based property discovery, and a robust application management system.

## 🚀 Core Features

### 👥 Multi-Role SaaS Architecture
- **Tenants**: Discover properties, apply for rentals, book tours, manage favorites, and chat with landlords/agents.
- **Landlords**: List and manage properties, review applications, schedule tours, and track property performance.
- **Agents**: Professional profiles, listing management, and client communication.
- **Admins**: Comprehensive user and application management, platform oversight.

### 💬 Real-Time Communication
- **Real-time Chat**: Built-in chat system for instant communication between tenants and landlords/agents.
- **Unread Message Tracking**: Dynamic notification system for new messages.

### 🗺️ Map Integration
- **Property Discovery**: Interactive map view (Leaflet/OpenStreetMap) to browse listings by location.
- **Map Picker**: Precision location selection for landlords when creating or editing property listings.
- **Coordinates Support**: Full latitude/longitude integration for accurate property positioning.

### 🏠 Property Management
- **Smart Filtering**: Advanced search by location, property type (Apartment, House, Land, Commercial), and price range.
- **Detailed Listings**: High-quality image galleries, property specifications, and landlord information.
- **Application Flow**: Integrated rental application system with move-in dates and personalized messages.

### 💎 Modern UI/UX
- **Premium Design**: Clean, vibrant, and responsive interface using Tailwind CSS.
- **Dynamic Feedback**: Toast notifications, loading states, and smooth transitions.
- **Custom Components**: Professional-grade hero sections, property cards, and data visualizations (Rates & Trends, Investment Hotspots).

## 🛠️ Technology Stack

### Frontend
- **React (Vite)**: Fast, component-based UI development.
- **TypeScript**: Static typing for robust code quality.
- **Tailwind CSS**: Utility-first styling for a premium aesthetic.
- **React Router**: Seamless client-side navigation.
- **Lucide React**: Beautiful, consistent iconography.
- **Axios**: Efficient API communication.
- **Socket.io-client**: Real-time websocket integration.

### Backend
- **Node.js & Express**: Scalable server-side logic.
- **Prisma ORM**: Type-safe database access and migrations.
- **PostgreSQL**: Reliable relational data storage.
- **JSON Web Tokens (JWT)**: Secure, role-based authentication.
- **Socket.io**: Real-time communication server.
- **Multer**: Robust file and image upload handling.

## 📦 Project Structure

```text
real-estate-app/
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks (useProperties, useAuth, etc.)
│   │   ├── pages/         # Page-level components
│   │   ├── services/      # API communication logic
│   │   └── auth-types/    # TypeScript interfaces
├── server/                # Backend Express API
│   ├── src/
│   │   ├── controllers/   # Request handling logic
│   │   ├── routes/        # API route definitions
│   │   ├── middlewares/   # Auth and role-based protection
│   │   └── utils/         # Helper functions (Prisma client)
│   └── prisma/            # Database schema and migrations
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database

### Installation
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd real-estate-app
   ```

2. **Backend Setup**:
   ```bash
   cd server
   npm install
   # Create a .env file with DATABASE_URL and JWT_SECRET
   npx prisma migrate dev
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

## 📝 License
This project is licensed under the MIT License.
