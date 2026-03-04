# AgentFlow - Complete Documentation

## 📖 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [API Reference](#api-reference)
5. [Installation](#installation)
6. [Deployment](#deployment)
7. [Configuration](#configuration)
8. [Scaling to Multiple Agents](#scaling-to-multiple-agents)
9. [Future Improvements](#future-improvements)
10. [Troubleshooting](#troubleshooting)

---

## Overview

**AgentFlow** is a complete SaaS platform for selling AI agents as a service. Built with Next.js frontend and powered by Nullclaw (Zig-based AI engine).

### What It Does

- Landing page to attract customers
- Customer dashboard to manage AI agents
- Connects to 50+ AI providers (Groq, OpenAI, Claude, etc.)
- Multi-channel support (WhatsApp, Telegram, Discord, etc.)
- Ready to sell for ₹2000-₹8000/month

### Business Model

| Plan | Price | Features |
|------|-------|----------|
| Starter | ₹2,000/mo | 1 agent, 1K messages |
| Professional | ₹5,000/mo | 3 agents, 10K messages |
| Enterprise | ₹8,000/mo | Unlimited agents |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CUSTOMER BROWSER                     │
│                  http://localhost:8080                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              NEXT.JS FRONTEND (Port 8080)               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Landing Page│  │  Dashboard  │  │  API Routes │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│           NULLCLAW GATEWAY (Port 3001)                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Agent     │  │   Memory    │  │   Tools     │     │
│  │   Engine    │  │   (SQLite)  │  │   (Shell)   │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              AI PROVIDERS (Groq, OpenAI)                │
│              CHANNELS (WhatsApp, Telegram)              │
└─────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Deployment:** Vercel (free)

### Backend
- **Engine:** Nullclaw (Zig 0.15.2)
- **Binary Size:** 168 MB
- **Memory:** ~1 MB RAM
- **Gateway:** Built-in HTTP/WebSocket

### Database
- **Memory:** SQLite (built-in)
- **Location:** `~/.nullclaw/memory.db`
- **Features:** Vector search, FTS5, hybrid retrieval

### AI Providers
- **Groq:** Llama 3.3 70B (free tier)
- **OpenRouter:** 50+ models
- **OpenAI:** GPT-4, GPT-3.5
- **Anthropic:** Claude family

---

## API Reference

### Frontend API Routes

#### POST /api/chat

Send a message to an AI agent.

**Request:**
```json
{
  "message": "Hello!",
  "agentId": "default"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "Hello! How can I help you?",
    "agentId": "default",
    "timestamp": "2026-03-04T15:00:00.000Z"
  }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Failed to process message"
}
```

#### GET /api/agents

List all configured agents.

**Response:**
```json
{
  "agents": [
    {
      "id": 1,
      "name": "Customer Support Bot",
      "status": "active",
      "channel": "WhatsApp",
      "model": "groq/llama-3.3-70b-versatile",
      "createdAt": "2026-03-04T15:00:00.000Z"
    }
  ]
}
```

#### POST /api/agents

Create a new agent.

**Request:**
```json
{
  "name": "Lead Generator",
  "type": "lead",
  "channel": "telegram",
  "model": "groq/llama-3.3-70b-versatile",
  "apiKey": "gsk_..."
}
```

#### DELETE /api/agents?id=1

Delete an agent.

---

### Nullclaw Gateway API

#### GET /health

Health check.

**Response:**
```json
{"status": "ok"}
```

#### POST /webhook

Send message to agent.

**Headers:**
```
Authorization: Bearer nullclaw-web-token-12345
Content-Type: application/json
```

**Request:**
```json
{
  "message": "Hello!",
  "agent_id": "default"
}
```

---

## Installation

### Local Development

#### Prerequisites

- Node.js 18+
- Zig 0.15.2 (for building nullclaw)
- Git

#### Step 1: Clone & Setup

```bash
# Clone or navigate to project
cd /teamspace/studios/this_studio

# Frontend
cd ai-agent-platform
npm install
npm run dev
# Runs on http://localhost:3000 or custom port
```

#### Step 2: Build Nullclaw

```bash
# Install Zig 0.15.2
cd /tmp
curl -LO https://ziglang.org/download/0.15.2/zig-x86_64-linux-0.15.2.tar.xz
tar -xf zig-x86_64-linux-0.15.2.tar.xz
export PATH="/tmp/zig-0.15.2:$PATH"

# Build nullclaw
cd /teamspace/studios/this_studio/nullclaw-repo
zig build
```

#### Step 3: Configure

```bash
# Create config
mkdir -p ~/.nullclaw
nano ~/.nullclaw/config.json
```

Add your API key:
```json
{
  "models": {
    "providers": {
      "groq": {
        "api_key": "gsk_your_key_here",
        "base_url": "https://api.groq.com/openai/v1"
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "groq/llama-3.3-70b-versatile"
      }
    }
  }
}
```

#### Step 4: Run

```bash
# Terminal 1: Frontend
cd ai-agent-platform
npm run dev -- -p 8080

# Terminal 2: Gateway
export PATH="/tmp/zig-0.15.2:$PATH"
cd nullclaw-repo
./zig-out/bin/nullclaw gateway --port 3001
```

---

## Deployment

### Option 1: Railway

#### Frontend (Next.js)

1. Push code to GitHub
2. Go to railway.app
3. Create new project → Deploy from GitHub
4. Select `ai-agent-platform` folder
5. Set environment variables:
   ```
   NULLCLAW_URL=https://your-vps-ip:3001/webhook
   NULLCLAW_TOKEN=nullclaw-web-token-12345
   ```
6. Deploy!

#### Backend (Nullclaw)

Railway doesn't support Zig binaries well. Use a VPS instead.

---

### Option 2: Bare Linux VPS

#### Prerequisites

- Ubuntu 20.04+ VPS (1 vCPU, 1GB RAM minimum)
- SSH access
- Domain name (optional)

#### Step 1: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Zig
cd /tmp
curl -LO https://ziglang.org/download/0.15.2/zig-x86_64-linux-0.15.2.tar.xz
tar -xf zig-x86_64-linux-0.15.2.tar.xz
sudo mv zig-0.15.2 /opt/zig
echo 'export PATH="/opt/zig:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

#### Step 2: Build Nullclaw

```bash
git clone https://github.com/nullclaw/nullclaw.git
cd nullclaw
zig build
sudo cp zig-out/bin/nullclaw /usr/local/bin/
```

#### Step 3: Configure

```bash
sudo mkdir -p /etc/nullclaw
sudo nano /etc/nullclaw/config.json
```

#### Step 4: Create Systemd Service

```bash
sudo nano /etc/systemd/system/nullclaw.service
```

Add:
```ini
[Unit]
Description=Nullclaw AI Gateway
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/nullclaw gateway --port 3001 --host 0.0.0.0
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable nullclaw
sudo systemctl start nullclaw
sudo systemctl status nullclaw
```

#### Step 5: Deploy Frontend

```bash
# Build for production
cd ai-agent-platform
npm run build

# Run with PM2
sudo npm install -g pm2
pm2 start npm --name "agentflow-frontend" -- start
pm2 save
pm2 startup
```

#### Step 6: Setup Nginx (Optional)

```bash
sudo apt install -y nginx

sudo nano /etc/nginx/sites-available/agentflow
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://localhost:8080;
    }
}
```

Enable:
```bash
sudo ln -s /etc/nginx/sites-available/agentflow /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### Option 3: Docker

#### Dockerfile (Frontend)

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
```

#### Dockerfile (Nullclaw)

```dockerfile
FROM zig:0.15.2

WORKDIR /app

COPY . .
RUN zig build

EXPOSE 3001

CMD ["./zig-out/bin/nullclaw", "gateway", "--port", "3001"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build: ./ai-agent-platform
    ports:
      - "8080:8080"
    environment:
      - NULLCLAW_URL=http://nullclaw:3001/webhook
      - NULLCLAW_TOKEN=nullclaw-web-token-12345
    depends_on:
      - nullclaw

  nullclaw:
    build: ./nullclaw-repo
    ports:
      - "3001:3001"
    volumes:
      - ./config:/root/.nullclaw

  # Optional: Database for multi-tenant
  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: your-password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Run:
```bash
docker-compose up -d
```

---

## Configuration

### Config File Location

```
~/.nullclaw/config.json
```

### Full Configuration Example

```json
{
  "default_temperature": 0.7,

  "models": {
    "providers": {
      "groq": {
        "api_key": "gsk_your_key",
        "base_url": "https://api.groq.com/openai/v1"
      },
      "openrouter": {
        "api_key": "sk-or-key"
      },
      "anthropic": {
        "api_key": "sk-ant-key",
        "base_url": "https://api.anthropic.com"
      }
    }
  },

  "agents": {
    "defaults": {
      "model": {
        "primary": "groq/llama-3.3-70b-versatile"
      },
      "heartbeat": {
        "every": "30m"
      }
    },
    "list": [
      {
        "id": "support-bot",
        "model": {
          "primary": "groq/llama-3.3-70b-versatile"
        },
        "system_prompt": "You are a helpful customer support agent."
      },
      {
        "id": "lead-gen",
        "model": {
          "primary": "openrouter/anthropic/claude-sonnet"
        },
        "system_prompt": "You are a lead generation specialist."
      }
    ]
  },

  "channels": {
    "cli": true,
    "web": {
      "accounts": {
        "default": {
          "transport": "local",
          "listen": "127.0.0.1",
          "port": 32123,
          "path": "/ws",
          "auth_token": "nullclaw-web-token-12345",
          "message_auth_mode": "token",
          "allowed_origins": ["*"]
        }
      }
    },
    "telegram": {
      "accounts": {
        "main": {
          "bot_token": "telegram-bot-token",
          "allow_from": ["user_id_1", "user_id_2"]
        }
      }
    }
  },

  "memory": {
    "backend": "sqlite",
    "auto_save": true,
    "hygiene_enabled": true,
    "archive_after_days": 7,
    "purge_after_days": 30
  },

  "gateway": {
    "port": 3001,
    "host": "127.0.0.1",
    "require_pairing": false
  },

  "autonomy": {
    "level": "supervised",
    "workspace_only": true,
    "max_actions_per_hour": 50,
    "allowed_commands": ["ls", "cat", "pwd", "echo"],
    "allowed_paths": ["/home/user/workspace"]
  },

  "security": {
    "sandbox": {
      "backend": "auto"
    },
    "audit": {
      "enabled": true,
      "retention_days": 90
    },
    "resources": {
      "max_memory_mb": 512,
      "max_cpu_percent": 80
    }
  }
}
```

### Environment Variables

```bash
# Frontend
NULLCLAW_URL=http://127.0.0.1:3001/webhook
NULLCLAW_TOKEN=nullclaw-web-token-12345
NULLCLAW_GATEWAY_TOKEN=nullclaw-web-token-12345

# Groq
GROQ_API_KEY=gsk_your_key

# OpenRouter
OPENROUTER_API_KEY=sk-or-key

# Telegram
TELEGRAM_BOT_TOKEN=telegram-token
```

---

## Scaling to Multiple Agents

### Architecture for Scale

```
                    ┌─────────────────┐
                    │   Load Balancer │
                    │   (Nginx/HAProxy)│
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  Gateway Node 1 │ │  Gateway Node 2 │ │  Gateway Node 3 │
│  (Port 3001)    │ │  (Port 3001)    │ │  (Port 3001)    │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   (Shared DB)   │
                    └─────────────────┘
```

### Step 1: Shared Database

Update config for PostgreSQL:

```json
{
  "memory": {
    "backend": "postgres",
    "postgres": {
      "url": "postgresql://user:pass@db-host:5432/nullclaw",
      "schema": "public",
      "table": "memories"
    }
  }
}
```

### Step 2: Multiple Gateway Nodes

Deploy on multiple VPS:

```bash
# VPS 1 (Mumbai)
./nullclaw gateway --port 3001 --host 0.0.0.0

# VPS 2 (Bangalore)
./nullclaw gateway --port 3001 --host 0.0.0.0

# VPS 3 (Delhi)
./nullclaw gateway --port 3001 --host 0.0.0.0
```

### Step 3: Load Balancer

Nginx configuration:

```nginx
upstream nullclaw_gateways {
    server vps1-ip:3001;
    server vps2-ip:3001;
    server vps3-ip:3001;
}

server {
    listen 80;
    server_name api.agentflow.com;

    location /webhook {
        proxy_pass http://nullclaw_gateways;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Step 4: Agent Routing

Configure different agents per node:

```json
// Node 1 config - Support bots
{
  "agents": {
    "list": [
      {"id": "support-1", ...},
      {"id": "support-2", ...}
    ]
  }
}

// Node 2 config - Lead gen
{
  "agents": {
    "list": [
      {"id": "lead-gen-1", ...},
      {"id": "lead-gen-2", ...}
    ]
  }
}
```

### Step 5: Multi-Tenant Setup

Database schema for multiple customers:

```sql
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    api_key VARCHAR(255) UNIQUE,
    plan VARCHAR(50),
    created_at TIMESTAMP
);

CREATE TABLE agents (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    name VARCHAR(255),
    config JSONB,
    status VARCHAR(50)
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    agent_id INTEGER REFERENCES agents(id),
    role VARCHAR(50),
    content TEXT,
    created_at TIMESTAMP
);
```

---

## Future Improvements

### Short Term (1-2 weeks)

1. **Authentication System**
   - Add Clerk or NextAuth
   - User signup/login
   - Session management

2. **Payment Integration**
   - Razorpay for India
   - Stripe for international
   - Subscription billing

3. **Real-time Updates**
   - WebSocket for live chat
   - Push notifications
   - Activity streaming

4. **Better Analytics**
   - Message volume charts
   - Response time tracking
   - Success rate metrics

### Medium Term (1-2 months)

5. **Multi-Tenant Database**
   - PostgreSQL migration
   - Customer isolation
   - Usage quotas

6. **Agent Templates**
   - Pre-built configs
   - Industry-specific bots
   - One-click deployment

7. **Channel Integrations**
   - WhatsApp Business API
   - Telegram bot builder
   - Discord server setup

8. **Team Collaboration**
   - Multiple users per account
   - Role-based access
   - Shared inboxes

### Long Term (3-6 months)

9. **Custom Model Fine-tuning**
   - Upload training data
   - Fine-tune on customer data
   - Custom embeddings

10. **Voice Support**
    - Whisper integration
    - Text-to-speech
    - Voice calls

11. **Advanced Tools**
    - Web browser automation
    - API builder
    - Code execution sandbox

12. **White-Label Option**
    - Custom branding
    - Custom domain
    - Remove AgentFlow branding

### Performance Optimizations

13. **Caching Layer**
    - Redis for sessions
    - Response caching
    - Rate limiting

14. **CDN for Frontend**
    - Vercel Edge Network
    - Static asset caching
    - Global distribution

15. **Database Optimization**
    - Connection pooling
    - Query optimization
    - Read replicas

16. **Agent Optimization**
    - Model cascading (cheap → expensive)
    - Response streaming
    - Batch processing

---

## Troubleshooting

### Common Issues

#### 1. "API Key Invalid"

**Symptoms:**
```
error: groq ApiError: {"error": {"message": "Invalid API key"}}
```

**Solution:**
- Check API key in `~/.nullclaw/config.json`
- Ensure no extra spaces
- Test with curl:
  ```bash
  curl -H "Authorization: Bearer gsk_your_key" \
    https://api.groq.com/openai/v1/models
  ```

#### 2. "Gateway Won't Start"

**Symptoms:**
```
Error: Address already in use
```

**Solution:**
```bash
# Find process using port 3001
lsof -i :3001

# Kill it
kill -9 <PID>

# Restart gateway
./zig-out/bin/nullclaw gateway --port 3001
```

#### 3. "Frontend Can't Connect"

**Symptoms:**
```
Nullclaw gateway not running
```

**Solution:**
- Check gateway is running: `curl http://127.0.0.1:3001/health`
- Verify NULLCLAW_URL in route.ts
- Check firewall: `sudo ufw status`

#### 4. "Rate Limit Exceeded"

**Symptoms:**
```
Rate limit reached for tokens per minute
```

**Solution:**
- Wait 60 seconds for reset
- Upgrade Groq plan
- Use multiple API keys
- Implement request queuing

#### 5. "Model Not Found"

**Symptoms:**
```
error: model decommissioned
```

**Solution:**
- Update model name in config
- Check Groq docs for current models
- Use `llama-3.3-70b-versatile` (current)

#### 6. "Build Fails"

**Symptoms:**
```
error: unable to find Zig compiler
```

**Solution:**
```bash
# Verify Zig installation
zig version

# Should output: 0.15.2

# If not, reinstall
export PATH="/tmp/zig-0.15.2:$PATH"
```

#### 7. "Memory Database Corrupted"

**Symptoms:**
```
SQLite error: database disk image is malformed
```

**Solution:**
```bash
# Backup
cp ~/.nullclaw/memory.db memory.db.backup

# Delete and recreate
rm ~/.nullclaw/memory.db

# Restart gateway
./zig-out/bin/nullclaw gateway
```

### Debug Commands

```bash
# Check all services
ps aux | grep -E "nullclaw|node|npm"

# View gateway logs
journalctl -u nullclaw -f

# Test API connectivity
curl http://127.0.0.1:3001/health

# Check memory usage
sqlite3 ~/.nullclaw/memory.db "SELECT COUNT(*) FROM conversations;"

# Monitor in real-time
watch -n 1 'curl -s http://127.0.0.1:3001/health'

# Network connections
netstat -tlnp | grep -E "3001|8080"
```

### Getting Help

1. **Logs:** `~/.nullclaw/logs/`
2. **Docs:** https://nullclaw.github.io
3. **GitHub:** https://github.com/nullclaw/nullclaw
4. **Config:** `~/.nullclaw/config.json`

---

## Quick Reference

### Essential Commands

```bash
# Start development
npm run dev                          # Frontend
./zig-out/bin/nullclaw gateway       # Backend

# Build for production
npm run build                        # Frontend
zig build -Doptimize=ReleaseSmall   # Nullclaw

# Check status
./zig-out/bin/nullclaw status
./zig-out/bin/nullclaw doctor

# Service management
sudo systemctl start nullclaw
sudo systemctl stop nullclaw
sudo systemctl restart nullclaw
sudo systemctl status nullclaw

# Test API
curl http://localhost:8080/api/agents
curl -X POST http://localhost:8080/api/chat -H "Content-Type: application/json" -d '{"message":"Hello"}'
```

### File Locations

```
~/.nullclaw/
├── config.json          # Main configuration
├── memory.db            # SQLite database
├── secrets/             # Encrypted API keys
└── logs/                # Audit logs

/teamspace/studios/this_studio/
├── ai-agent-platform/   # Frontend
├── nullclaw-repo/       # Nullclaw source
├── .nullclaw/           # Config
└── SETUP.md             # Setup guide
```

### Ports

| Service | Port | Purpose |
|---------|------|---------|
| Frontend | 8080 | Web UI |
| Gateway | 3001 | AI API |
| WebChannel | 32123 | WebSocket |

---

## License

MIT License - See LICENSE file

## Support

For issues or questions:
1. Check this documentation
2. Review troubleshooting section
3. Check nullclaw docs: https://nullclaw.github.io

---

**Built with ❤️ for selling AI agents**
