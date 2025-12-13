# 🌍 Ariane World Builder

> An interactive story event flowchart builder for writers and creators

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-brightgreen)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## ✨ Features

- 🎨 **Visual Story Mapping** - Create and connect story events in an intuitive flowchart
- 📝 **Event Management** - Add titles, descriptions, and organize narrative structure
- 🌐 **Multi-World Support** - Manage multiple stories/projects separately
- 🔐 **User Authentication** - Secure login and personal workspace
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ⚡ **Real-time Updates** - Instant synchronization with database
- 🎯 **Context Actions** - Right-click menu for quick operations
- 🔗 **Event Connections** - Link events to show narrative flow

## 🚀 Quick Start

### Prerequisites

- [Docker](https://www.docker.com/) installed on your system
- [Node.js 18+](https://nodejs.org/) (for local development without Docker)

### Installation

#### 🐧 macOS/Linux/WSL

```bash
# Make setup script executable
chmod +x ./scripts/setup.sh

# Run setup
./scripts/setup.sh
```

#### 🪟 Windows (PowerShell)

```powershell
# Allow script execution (run once)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# Run setup
.\scripts\setup.ps1
```

### What the setup does:

1. ✅ Checks Docker installation
2. ✅ Creates `.env` file with defaults
3. ✅ Builds and starts Docker containers
4. ✅ Waits for PostgreSQL to be ready
5. ✅ Generates Prisma client
6. ✅ Runs database migrations
7. ✅ Starts the application

The application will be available at: **http://localhost:3000**

## 📦 Manual Setup (without Docker)

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database URL

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Start development server
npm run dev
```

## 🎯 Core Concepts

### Worlds

Containers for your stories. Each world is isolated and can contain multiple events.

### Events

Individual story moments or chapters. Each event has:

- **Title** - Name of the event
- **Description** - Details about what happens
- **Position** - Location on the canvas
- **Connections** - Links to other events

### Flow Canvas

Interactive drag-and-drop interface where you:

- Create events with floating action button
- Connect events by dragging between handles
- Move events by dragging
- Delete via context menu (right-click)
- Edit by double-clicking

## 🛠️ Technology Stack

| Technology            | Purpose                         |
| --------------------- | ------------------------------- |
| **Next.js 14**        | React framework with App Router |
| **TypeScript**        | Type-safe JavaScript            |
| **Prisma**            | Type-safe database ORM          |
| **PostgreSQL**        | Relational database             |
| **NextAuth.js**       | Authentication                  |
| **@xyflow/react**     | Flow diagram library            |
| **Tailwind CSS**      | Utility-first styling           |
| **Tailwind Variants** | Component styling system        |

## 🔒 Security

- 🔐 Password hashing with bcrypt
- 🛡️ CSRF protection enabled
- ✅ Input validation with Zod schemas
- 🔑 Session-based authentication
- 🚫 SQL injection prevention via Prisma

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ariane"

# Authentication
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: for production
NODE_ENV="production"
```

## 🐳 Docker Configuration

The project includes Docker setup for easy deployment:

```yaml
services:
  app: # Next.js application
  db: # PostgreSQL database
```

**Ports:**

- Application: `3000`
- Database: `5432`

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### Common Issues

**Database connection failed:**

```bash
# Check if PostgreSQL is running
docker ps

# Restart containers
docker compose restart
```

**Prisma client errors:**

```bash
# Regenerate Prisma client
npx prisma generate

# Reset database (WARNING: deletes data)
npx prisma migrate reset
```

**Port 3000 already in use:**

```bash
# Find and kill process using port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 👥 Authors

- lfourage - Initial work

---

Made with ❤️ for storytellers and creators
