# 🤖 AbetWorks Agent Fleet

**Your Fleet of AI Employees** - Multi-tenant AI agent deployment platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Zig](https://img.shields.io/badge/Zig-0.15.2-orange?logo=zig)](https://ziglang.org/)

---

## 🎯 What It Is

**AbetWorks Agent Fleet** is a complete SaaS platform for deploying and managing AI agents at scale. Deploy fleets of AI employees for your customers - customer support bots, lead generators, research assistants, and more.

---

## ✨ Features

- ✅ **Multi-Tenant** - Manage multiple customers from one dashboard
- ✅ **Multi-Agent** - Deploy multiple agents per customer
- ✅ **Multi-Channel** - WhatsApp, Telegram, Discord, Slack, Web
- ✅ **Multi-Model** - Groq, OpenAI, Anthropic, OpenRouter
- ✅ **Full API** - REST API for automation
- ✅ **Webhooks** - Real-time event notifications
- ✅ **Tools** - Memory, web search, file access, HTTP requests, database
- ✅ **SDKs** - JavaScript & Python SDKs
- ✅ **Analytics** - Monitor usage, performance, and satisfaction

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Zig 0.15.2 (for building nullclaw)
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/coding4vinayak/aw-agent-fleet.git
cd aw-agent-fleet

# Install dependencies
cd ai-agent-platform
npm install

# Set up environment
cp .env.example .env.local

# Start development server
npm run dev
```

### Build Nullclaw (Backend)

```bash
# Install Zig 0.15.2
cd /tmp
curl -LO https://ziglang.org/download/0.15.2/zig-x86_64-linux-0.15.2.tar.xz
tar -xf zig-x86_64-linux-0.15.2.tar.xz
export PATH="/tmp/zig-0.15.2:$PATH"

# Build nullclaw
cd nullclaw-repo
zig build

# Start gateway
./zig-out/bin/nullclaw gateway --port 3001
```

---

## 📁 Project Structure

```
aw-agent-fleet/
├── ai-agent-platform/       # Next.js frontend & API
│   ├── app/
│   │   ├── page.tsx         # Landing page
│   │   ├── admin/           # Admin dashboard
│   │   ├── customers/       # Customer management
│   │   └── api/             # API routes
│   ├── package.json
│   └── README.md
├── nullclaw-repo/           # Nullclaw (Zig AI engine)
├── agent-manager.sh         # Agent deployment script
├── deploy-customer.sh       # Customer deployment script
├── COMPLETE_DEVELOPER_DOCS.md
├── DEPLOYMENT.md
└── README.md
```

---

## 💼 Business Model

### Plans

| Plan | Price | Features |
|------|-------|----------|
| Starter | ₹2,000/mo | 1 agent, 1K messages |
| Professional | ₹5,000/mo | 3 agents, 10K messages |
| Enterprise | ₹8,000/mo | Unlimited agents |

### Revenue Potential

- 10 customers = ~₹50,000/month
- 50 customers = ~₹2,50,000/month
- 100 customers = ~₹5,00,000/month

---

## 🎯 Use Cases

### 1. Restaurant
- Reservation Bot (WhatsApp)
- FAQ Assistant (Telegram)
- Feedback Collector (WhatsApp)

### 2. Real Estate
- Lead Qualifier (Telegram)
- Viewing Scheduler (WhatsApp)
- Property Advisor (Web)

### 3. E-commerce
- Support Bot (WhatsApp + Telegram)
- Sales Assistant (WhatsApp)
- Order Tracker (Web)

### 4. Enterprise
- Research Agent
- DevOps Automation
- Content Creator

---

## 📖 Documentation

- **[COMPLETE_DEVELOPER_DOCS.md](./COMPLETE_DEVELOPER_DOCS.md)** - Complete API reference, SDKs, webhooks, tools
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deploy to Vercel, VPS, Docker, Railway
- **[MULTI_AGENT_DEPLOYMENT.md](./MULTI_AGENT_DEPLOYMENT.md)** - Deploy multiple agents per customer
- **[BRANDING.md](./BRANDING.md)** - Brand guidelines

---

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

### Backend
- **Engine:** Nullclaw (Zig 0.15.2)
- **Binary Size:** ~168 MB
- **Memory:** ~1 MB RAM per agent
- **Gateway:** Built-in HTTP/WebSocket

### Database
- **Memory:** SQLite (built-in)
- **Optional:** PostgreSQL, Redis

### AI Providers
- **Groq:** Llama 3.3 70B (free tier)
- **OpenRouter:** 50+ models
- **OpenAI:** GPT-4, GPT-3.5
- **Anthropic:** Claude family

---

## 🔧 Key Commands

### Development
```bash
# Frontend
cd ai-agent-platform
npm run dev              # Start dev server (port 8080)
npm run build            # Build for production
npm start                # Start production server

# Backend
export PATH="/tmp/zig-0.15.2:$PATH"
cd nullclaw-repo
zig build                # Build nullclaw
./zig-out/bin/nullclaw gateway --port 3001
```

### Agent Management
```bash
# Create agent for customer
./agent-manager.sh <customer_id> create

# Start all agents for customer
./agent-manager.sh <customer_id> start

# Check status
./agent-manager.sh <customer_id> status

# List all agents
./agent-manager.sh <customer_id> list-agents
```

### Deployment
```bash
# Deploy new customer
./deploy-customer.sh
```

---

## 🌐 Access Points

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:8080 | 8080 |
| Admin Dashboard | http://localhost:8080/admin | 8080 |
| Customer Dashboard | http://localhost:8080/customers | 8080 |
| API | http://localhost:8080/api | 8080 |
| Nullclaw Gateway | http://127.0.0.1:3001 | 3001 |

---

## 📋 Environment Variables

```bash
# .env.local

# Nullclaw Gateway
NULLCLAW_URL=http://127.0.0.1:3001/webhook
NULLCLAW_TOKEN=nullclaw-web-token-12345

# API Keys (for your own agents)
GROQ_API_KEY=gsk_...
OPENROUTER_API_KEY=sk-or-...
ANTHROPIC_API_KEY=sk-ant-...
```

---

## 🚀 Deployment

### Vercel (Frontend)
```bash
vercel deploy
```

### VPS (Backend)
```bash
# Ubuntu/Debian
apt update && apt upgrade -y
apt install -y nodejs

# Install Zig
cd /tmp
curl -LO https://ziglang.org/download/0.15.2/zig-x86_64-linux-0.15.2.tar.xz
tar -xf zig-x86_64-linux-0.15.2.tar.xz
mv zig-0.15.2 /opt/zig

# Build nullclaw
cd nullclaw-repo
zig build
cp zig-out/bin/nullclaw /usr/local/bin/

# Start service
systemctl enable nullclaw
systemctl start nullclaw
```

### Docker
```bash
docker-compose up -d
```

---

## 🔐 Security

- ✅ API key encryption
- ✅ Webhook signature verification
- ✅ Sandbox execution
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Customer isolation

---

## 📊 Monitoring

### Logs
```bash
# Agent logs
tail -f /opt/abetworks/customers/<customer_id>/logs/<agent_id>.log

# Platform logs
journalctl -u nullclaw -f
```

### Health Checks
```bash
curl http://localhost:3001/health
curl http://localhost:8080/api/health
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

- **Documentation:** See [COMPLETE_DEVELOPER_DOCS.md](./COMPLETE_DEVELOPER_DOCS.md)
- **Issues:** Open an issue on GitHub
- **Email:** hello@abetworks.ai

---

## 🎉 Acknowledgments

- [Nullclaw](https://github.com/nullclaw/nullclaw) - AI agent engine
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide Icons](https://lucide.dev/) - Icons

---

**Built with ❤️ by AbetWorks**

*Your Fleet of AI Employees*
