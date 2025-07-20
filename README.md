# Loominal - AI-Powered Knowledge Engine

An intelligent knowledge engine that transforms scattered project context from GitHub, Linear, Slack, Figma, and Notion into instant, cited answers. Designed to accelerate team onboarding and eliminate the productivity tax of knowledge transfer.

## What It Does

Loominal solves the silent productivity problem every development team faces: new team members have countless questions but hesitate to interrupt busy teammates. Instead of forcing slow, isolated learning through scattered documentation, Loominal creates a unified source of truth that provides contextual answers with full source citations.

## Architecture

This project uses a dual-application architecture:

- **Next.js Frontend** (`/client`) - Main user interface, authentication, dashboard, and project management
- **Flask Backend** (`/server`) - AI processing specialist using Vellum Python SDK

## Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Python 3.8+ and pip
- PostgreSQL database (we recommend [Neon](https://neon.tech) for development)

### 1. Clone and Setup

```bash
git clone https://github.com/code-like-crazy/ht6.git
cd ht6
```

### 2. Start the Next.js Frontend

```bash
cd client
npm install
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000)

### 3. Start the Flask Backend

In a new terminal:

```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env file with your configuration
python app.py
```

The backend API will be available at [http://localhost:5000](http://localhost:5000)

## Environment Setup

### Next.js Environment Variables

Create `client/.env.local`:

```env
# Auth0 Configuration
AUTH0_SECRET=your-auth0-secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=your-auth0-domain
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret

# Database
DATABASE_URL=your-postgresql-connection-string

# API
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Flask Environment Variables

Create `server/.env`:

```env
FLASK_ENV=development
FLASK_DEBUG=True
# Add your Vellum AI and other service configurations here
```

## Tech Stack

- **Frontend**: Next.js, TypeScript, React, TailwindCSS
- **Backend**: Flask (Python), Vellum AI
- **Database**: PostgreSQL with DrizzleORM
- **Authentication**: Auth0
- **Integrations**: GitHub, Slack, Linear, Figma, Notion APIs

## Key Features

- 🔐 **Secure Authentication** - Auth0 integration with social login
- 🏢 **Organization Management** - Multi-tenant workspace support
- 🔗 **Tool Integration** - Connect GitHub, Linear, Slack, Figma, Notion
- 💬 **Intelligent Chat** - Natural language queries with contextual answers
- 📚 **Source Citations** - Every answer includes clickable references
- ⚡ **Real-time Responses** - Fast, contextual knowledge retrieval

## Project Structure

```
ht6/
├── client/                 # Next.js frontend application
│   ├── src/app/           # App router pages and API routes
│   ├── src/components/    # Reusable React components
│   ├── src/lib/          # Utilities and configurations
│   └── src/server/       # Server-side database and services
├── server/                # Flask backend application
│   ├── routes/           # API endpoint blueprints
│   ├── app.py           # Main Flask application
│   └── config.py        # Configuration settings
└── memory-bank/          # Project documentation and context
```

## Development

### Frontend Development

See [client/README.md](./client/README.md) for detailed Next.js development instructions.

### Backend Development

See [server/README.md](./server/README.md) for detailed Flask development instructions.

### Database Management

The project uses DrizzleORM for type-safe database operations. Database schema is defined in `client/src/server/db/schema.ts`.

## Target User

**"Rachel" - New Software Engineer**
- Goal: Start contributing valuable code and integrate with the team quickly
- Frustration: "I have so many 'why' questions, but answers are scattered across dozens of Slack channels and hundreds of Linear tickets. I don't want to constantly ping the lead developer."