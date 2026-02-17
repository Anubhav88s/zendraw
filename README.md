<p align="center">
  <img src="apps/excelidraw-frontend/public/logo.png" alt="Zendraw Logo" width="80" />
</p>

<h1 align="center">Zendraw</h1>

<p align="center">
  <b>Collaborative whiteboarding made effortless.</b><br/>
  Draw, brainstorm, and create together in real-time — completely free.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Express-4-000000?logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/WebSocket-Real--time-blue?logo=websocket" alt="WebSocket" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Turborepo-Monorepo-EF4444?logo=turborepo" alt="Turborepo" />
</p>

---

## 📸 Screenshots

### Landing Page
![Landing Page](screenshots/landing.png)

### Sign Up
![Sign Up](screenshots/signup.png)

### Sign In
![Sign In](screenshots/signin.png)

### Dashboard — Room Management
![Dashboard](screenshots/dashboard.png)

### Canvas — Drawing Tools
![Canvas](screenshots/canvas.png)

---

## ✨ Features

### 🎨 Drawing Tools
- **Pencil** — Freehand drawing with smooth strokes
- **Rectangle** — Draw rectangles with customizable stroke colors
- **Diamond** — Create diamond/rhombus shapes
- **Circle** — Draw perfect circles and ellipses
- **Arrow** — Draw directional arrows for flowcharts and diagrams
- **Line** — Straight line tool for precise connections
- **Text** — Add text annotations anywhere on the canvas
- **Eraser** — Remove individual shapes or strokes

### 🎯 Customization
- **Background Colors** — Choose from multiple canvas background colors (black, dark gray, white, violet, blue, green)
- **Stroke Colors** — 8 vibrant stroke color options (white, black, red, orange, green, teal, purple)
- **Line Thickness** — Three thickness levels: Thin, Medium, and Thick

### 🔍 Pan & Zoom
- **Zoom In/Out** — Scroll with mouse wheel to zoom in and out smoothly
- **Keyboard Zoom** — Use `Ctrl +` / `Ctrl -` to zoom in and out
- **Reset Zoom** — Press `Ctrl 0` to reset to 100% zoom level
- **Zoom Indicator** — Live zoom percentage display on the canvas
- **Infinite Canvas** — Pan freely across an unlimited workspace by clicking and dragging

### 📱 Mobile & Tablet Support
- **Touch Drawing** — Draw with finger on touch devices (all tools supported)
- **Pinch-to-Zoom** — Two-finger pinch gesture for zooming in/out on the canvas
- **Responsive Canvas** — Canvas auto-resizes on device rotation and window resize
- **Touch-Optimized** — Browser scroll/zoom disabled on canvas for smooth drawing

### 👥 Real-time Collaboration
- **Live Multi-user Drawing** — See teammates draw in real-time via WebSockets
- **Room-based Sessions** — Create or join rooms using unique slugs
- **Shape Sync** — All shapes are instantly broadcasted to all room participants
- **Shape Deletion Sync** — Deleting a shape removes it for everyone in real-time
- **Persistent Canvas** — All drawings are saved to the database and restored when you rejoin

### 📤 Export Options
- **Export as PDF** — Download your whiteboard as a PDF document
- **Export as PNG** — Save a high-quality PNG image of your canvas

### 🏠 Dashboard
- **Room Management** — View all your created rooms in one place
- **Create Room** — Instantly create new whiteboard rooms with optional password protection
- **Join Room** — Join any room by entering its slug
- **Delete Room** — Remove rooms you've created (admin only)
- **Room Cards** — See room name, creation date, and quick open action

---

## 🔒 Security Features

| Feature | Description |
|---------|-------------|
| **Password Hashing** | All user passwords are hashed using `bcrypt` with 10 salt rounds before storage |
| **JWT Authentication** | Token-based authentication using `jsonwebtoken` for stateless session management |
| **Rate Limiting** | Auth routes (`/signin`, `/signup`, `/room/verify-password`) are rate-limited to **10 requests per 15 minutes** per IP using `express-rate-limit` |
| **Helmet** | HTTP security headers (XSS protection, content sniffing prevention, clickjacking defense, HSTS) via `helmet` middleware |
| **Password-Protected Rooms** | Room creators can set a password; joiners must verify it before accessing the canvas |
| **Secure Password Passing** | Room passwords are passed via `sessionStorage` instead of URL query parameters, preventing exposure in browser history and server logs |
| **WebSocket Token Verification** | WebSocket connections require a valid JWT token passed as a query parameter; unauthorized connections are immediately closed |
| **Input Validation** | All API inputs are validated using `Zod` schemas (`CreateUserSchema`, `SigninSchema`, `CreateRoomSchema`) before processing |
| **CORS** | Cross-Origin Resource Sharing is configured to control which origins can access the API |

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **Next.js 15** | React framework with App Router, SSR, and file-based routing |
| **TypeScript** | Type-safe development across the entire codebase |
| **Tailwind CSS** | Utility-first CSS framework for rapid UI development |
| **Lucide React** | Beautiful, consistent icon library |
| **HTML5 Canvas API** | Core drawing engine for the whiteboard |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Express.js** | RESTful HTTP API server for auth, rooms, and data |
| **WebSocket (ws)** | Real-time bidirectional communication for live collaboration |
| **Prisma** | Type-safe ORM for database queries and migrations |
| **PostgreSQL** | Relational database for persistent storage |
| **bcrypt** | Password hashing with salt rounds |
| **JWT** | Stateless authentication tokens |
| **Helmet** | HTTP security headers middleware |
| **express-rate-limit** | API rate limiting for brute-force protection |

### Infrastructure
| Technology | Purpose |
|-----------|---------|
| **Turborepo** | High-performance monorepo build system with caching |
| **pnpm** | Fast, disk-efficient package manager with workspace support |
| **Zod** | Runtime schema validation for API inputs |

---

## 📁 Project Structure

```
draw-app/
├── apps/
│   ├── excelidraw-frontend/     # Next.js frontend application
│   │   ├── app/                 # App Router pages (signin, signup, dashboard, canvas)
│   │   ├── components/          # Reusable UI components
│   │   │   ├── homepage/        # Landing page components (Header, Hero, Footer, etc.)
│   │   │   ├── Canvas.tsx       # Main canvas component with toolbar
│   │   │   └── RoomCanvas.tsx   # Room-aware canvas wrapper
│   │   └── draw/                # Canvas drawing engine (Game.ts)
│   │
│   ├── http-backend/            # Express REST API server (port 3001)
│   │   └── src/
│   │       ├── index.ts         # Server setup, middleware & route mounting
│   │       ├── middleware.ts    # JWT auth middleware
│   │       ├── rateLimit.ts     # Rate limiter configuration
│   │       └── routes/
│   │           ├── auth.ts      # Auth routes (signup, signin)
│   │           └── room.ts      # Room & chat routes
│   │
│   └── ws-backend/              # WebSocket server (port 8080)
│       └── src/
│           └── index.ts         # Real-time message handling
│
├── packages/
│   ├── db/                      # Prisma client & schema
│   │   └── prisma/
│   │       └── schema.prisma    # Database models (User, Room, Chat)
│   ├── common/                  # Shared Zod validation schemas
│   ├── backend-common/          # Shared backend config (JWT_SECRET)
│   ├── ui/                      # Shared UI component library
│   ├── eslint-config/           # Shared ESLint configuration
│   └── typescript-config/       # Shared TypeScript configuration
│
├── turbo.json                   # Turborepo pipeline configuration
├── pnpm-workspace.yaml          # pnpm workspace definition
└── package.json                 # Root scripts & dependencies
```

---

## 🗄️ Database Schema

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User      │       │    Room      │       │    Chat      │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (UUID)   │──┐    │ id (Auto)   │──┐    │ id (Auto)   │
│ email       │  │    │ slug        │  │    │ roomId      │──→ Room.id
│ password    │  │    │ createdAt   │  │    │ message     │
│ name        │  ├──→ │ adminId     │  ├──→ │ userId      │──→ User.id
│ photo?      │  │    │ password?   │  │    │ shapeId?    │
│             │  │    │             │  │    │             │
└─────────────┘  │    └─────────────┘  │    └─────────────┘
                 │                      │
                 └── One-to-Many ───────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 9.0.0
- **PostgreSQL** database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anubhav88s/zendraw.git
   cd zendraw
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in `packages/db/` with:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/zendraw"
   ```

   Create a `.env` file in `apps/http-backend/` with:
   ```env
   JWT_SECRET="your-secret-key"
   ```

4. **Set up the database**
   ```bash
   cd packages/db
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development servers**
   ```bash
   # From the root directory
   pnpm run dev
   ```

   This starts all services simultaneously via Turborepo:
   | Service | Port | Description |
   |---------|------|-------------|
   | Frontend | `3000` | Next.js application |
   | HTTP API | `3001` | Express REST server |
   | WebSocket | `8080` | Real-time collaboration server |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Auth | Rate Limited | Description |
|--------|----------|:----:|:------------:|-------------|
| `POST` | `/signup` | ❌ | ✅ | Create a new account |
| `POST` | `/signin` | ❌ | ✅ | Sign in and receive JWT |

### Rooms
| Method | Endpoint | Auth | Rate Limited | Description |
|--------|----------|:----:|:------------:|-------------|
| `POST` | `/room` | ✅ | ❌ | Create a new room |
| `GET` | `/room/:slug` | ❌ | ❌ | Get room details |
| `GET` | `/rooms` | ✅ | ❌ | List all your rooms |
| `DELETE` | `/room/:slug` | ✅ | ❌ | Delete a room (admin only) |
| `POST` | `/room/verify-password` | ❌ | ✅ | Verify room password |

### Chats / Shapes
| Method | Endpoint | Auth | Rate Limited | Description |
|--------|----------|:----:|:------------:|-------------|
| `GET` | `/chats/:roomId` | ❌ | ❌ | Get all shapes in a room |

### Health Check
| Method | Endpoint | Auth | Rate Limited | Description |
|--------|----------|:----:|:------------:|-------------|
| `GET` | `/health` | ❌ | ❌ | Health check for deployment monitoring |

### WebSocket Events
| Event | Direction | Description |
|-------|-----------|-------------|
| `join_room` | Client → Server | Join a room for real-time updates |
| `leave_room` | Client → Server | Leave a room |
| `chat` | Bidirectional | Send/receive shape data |
| `delete_shape` | Bidirectional | Send/receive shape deletions |

---

## 👤 Author

**Anubhav Raj Singh**

- 📧 Email: [anubhavrajsinghu@gmail.com](mailto:anubhavrajsinghu@gmail.com)
- 🔗 LinkedIn: [Anubhav Raj Singh](https://www.linkedin.com/in/anubhav-raj-singh-88a03b2b5/)
- 🐙 GitHub: [@Anubhav88s](https://github.com/Anubhav88s)

---

## 📄 License

© 2026 Zendraw. All rights reserved.

