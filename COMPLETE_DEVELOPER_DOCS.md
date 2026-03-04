# 🚀 AbetWorks Agent Fleet - Complete Developer Documentation

## 📖 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [APIs & SDKs](#apis--sdks)
4. [Webhooks](#webhooks)
5. [Tools & Capabilities](#tools--capabilities)
6. [Creating Agents](#creating-agents)
7. [Channel Integration](#channel-integration)
8. [Deployment](#deployment)
9. [Monitoring & Debugging](#monitoring--debugging)
10. [Examples](#examples)

---

## Overview

**AbetWorks Agent Fleet** is a multi-tenant platform for deploying AI agents at scale.

### What You Can Build:
- Customer support bots
- Lead generation agents
- Research assistants
- Reservation bots
- FAQ assistants
- Sales agents
- DevOps automation
- Content creators
- And unlimited more!

### Key Features:
- ✅ Multi-tenant (multiple customers)
- ✅ Multi-agent (multiple agents per customer)
- ✅ Multi-channel (WhatsApp, Telegram, Discord, etc.)
- ✅ Multi-model (Groq, OpenAI, Claude, etc.)
- ✅ Full API access
- ✅ Webhook support
- ✅ SDK for custom integrations

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────┐
│              AbetWorks Platform                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Frontend   │  │  Admin API   │  │  Customer    │ │
│  │  (Next.js)   │  │   (REST)     │  │    API       │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Webhook    │  │   Agent      │  │   Channel    │ │
│  │   Handler    │  │   Manager    │  │   Manager    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
         ▼           ▼           ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   WhatsApp  │ │  Telegram   │ │   Discord   │
│   API       │ │  Bot API    │ │   API       │
└─────────────┘ └─────────────┘ └─────────────┘
```

### Agent Architecture

```
┌─────────────────────────────────────────┐
│  Agent Configuration                    │
│  - agent_id                             │
│  - customer_id                          │
│  - type (support/sales/etc)             │
│  - channel (whatsapp/telegram/etc)      │
│  - model (groq/openai/claude)           │
│  - system_prompt                        │
│  - tools (enabled features)             │
│  - webhooks (callbacks)                 │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│  Agent Runtime (Nullclaw)               │
│  - Message processing                   │
│  - LLM inference                        │
│  - Tool execution                       │
│  - Memory management                    │
│  - Webhook callbacks                    │
└─────────────────────────────────────────┘
```

---

## APIs & SDKs

### REST API Reference

#### Base URL
```
Production: https://api.abetworks.ai/v1
Development: http://localhost:8080/api
```

#### Authentication
```
Headers:
  Authorization: Bearer <your_api_key>
  Content-Type: application/json
```

---

### Agent Management API

#### 1. List All Agents
```http
GET /api/agents?customer_id={customer_id}
```

**Response:**
```json
{
  "agents": [
    {
      "agent_id": "support-bot",
      "customer_id": "taj_restaurant",
      "type": "support",
      "channel": "whatsapp",
      "status": "active",
      "created_at": "2026-03-04T10:00:00Z"
    },
    {
      "agent_id": "faq-bot",
      "customer_id": "taj_restaurant",
      "type": "faq",
      "channel": "telegram",
      "status": "active",
      "created_at": "2026-03-04T11:00:00Z"
    }
  ]
}
```

#### 2. Create Agent
```http
POST /api/agents
```

**Request:**
```json
{
  "customer_id": "taj_restaurant",
  "agent_id": "reservation-bot",
  "type": "reservation",
  "channel": "whatsapp",
  "model": {
    "provider": "groq",
    "api_key": "gsk_...",
    "model": "llama-3.3-70b-versatile"
  },
  "system_prompt": "You are a restaurant reservation assistant...",
  "tools": {
    "memory": true,
    "web_search": false,
    "file_access": false
  },
  "webhooks": {
    "on_message": "https://your-server.com/webhook/message",
    "on_complete": "https://your-server.com/webhook/complete"
  }
}
```

**Response:**
```json
{
  "success": true,
  "agent": {
    "agent_id": "reservation-bot",
    "status": "created",
    "port": 3001
  }
}
```

#### 3. Update Agent
```http
PUT /api/agents/{customer_id}/{agent_id}
```

**Request:**
```json
{
  "system_prompt": "Updated prompt...",
  "status": "paused"
}
```

#### 4. Delete Agent
```http
DELETE /api/agents?customer_id={customer_id}&agent_id={agent_id}
```

#### 5. Start Agent
```http
POST /api/agents/{customer_id}/{agent_id}/start
```

#### 6. Stop Agent
```http
POST /api/agents/{customer_id}/{agent_id}/stop
```

#### 7. Get Agent Status
```http
GET /api/agents/{customer_id}/{agent_id}/status
```

**Response:**
```json
{
  "agent_id": "reservation-bot",
  "status": "running",
  "port": 3001,
  "uptime": "2h 34m",
  "messages_processed": 156,
  "last_message": "2026-03-04T12:30:00Z"
}
```

---

### Customer Management API

#### 1. Create Customer
```http
POST /api/customers
```

**Request:**
```json
{
  "name": "Taj Mahal Restaurant",
  "email": "contact@tajrestaurant.com",
  "phone": "+91-9876543210",
  "business_type": "restaurant",
  "plan": "professional"
}
```

#### 2. List Customers
```http
GET /api/customers
```

#### 3. Get Customer Details
```http
GET /api/customers/{customer_id}
```

#### 4. Update Customer
```http
PUT /api/customers/{customer_id}
```

#### 5. Delete Customer
```http
DELETE /api/customers/{customer_id}
```

---

### Message API

#### 1. Send Message to Agent
```http
POST /api/messages
```

**Request:**
```json
{
  "customer_id": "taj_restaurant",
  "agent_id": "reservation-bot",
  "from": "+91-9876543210",
  "message": "I want to book a table for 4",
  "channel": "whatsapp"
}
```

**Response:**
```json
{
  "message_id": "msg_123",
  "status": "processing",
  "response": "Sure! What time would you like to book?"
}
```

#### 2. Get Message History
```http
GET /api/messages?customer_id={customer_id}&agent_id={agent_id}&from={user_id}
```

---

### Analytics API

#### 1. Get Agent Analytics
```http
GET /api/analytics/agents/{customer_id}/{agent_id}
```

**Response:**
```json
{
  "total_messages": 1234,
  "today_messages": 156,
  "avg_response_time": "1.2s",
  "user_satisfaction": 4.8,
  "top_questions": [
    {"question": "What are your hours?", "count": 45},
    {"question": "Do you have parking?", "count": 32}
  ]
}
```

#### 2. Get Customer Analytics
```http
GET /api/analytics/customers/{customer_id}
```

#### 3. Get Platform Analytics
```http
GET /api/analytics/platform
```

---

## Webhooks

### What are Webhooks?

Webhooks let you receive real-time notifications when events happen in your agents.

### Available Webhooks

#### 1. on_message
**Triggered:** When a user sends a message

**Payload:**
```json
{
  "event": "on_message",
  "timestamp": "2026-03-04T12:30:00Z",
  "customer_id": "taj_restaurant",
  "agent_id": "reservation-bot",
  "from": "+91-9876543210",
  "message": "I want to book a table",
  "channel": "whatsapp"
}
```

#### 2. on_response
**Triggered:** When agent sends a response

**Payload:**
```json
{
  "event": "on_response",
  "timestamp": "2026-03-04T12:30:02Z",
  "customer_id": "taj_restaurant",
  "agent_id": "reservation-bot",
  "from": "+91-9876543210",
  "response": "Sure! What time would you like?",
  "channel": "whatsapp"
}
```

#### 3. on_complete
**Triggered:** When conversation completes

**Payload:**
```json
{
  "event": "on_complete",
  "timestamp": "2026-03-04T12:35:00Z",
  "customer_id": "taj_restaurant",
  "agent_id": "reservation-bot",
  "from": "+91-9876543210",
  "summary": "Table booked for 4 people at 8 PM",
  "duration": "5m"
}
```

#### 4. on_error
**Triggered:** When an error occurs

**Payload:**
```json
{
  "event": "on_error",
  "timestamp": "2026-03-04T12:30:00Z",
  "customer_id": "taj_restaurant",
  "agent_id": "reservation-bot",
  "error": "API rate limit exceeded",
  "severity": "warning"
}
```

### Setting Up Webhooks

#### Via Dashboard:
1. Go to Admin Dashboard
2. Select Agent
3. Click "Webhooks" tab
4. Add webhook URLs
5. Select events to subscribe
6. Save

#### Via API:
```http
PUT /api/agents/{customer_id}/{agent_id}/webhooks
```

**Request:**
```json
{
  "webhooks": {
    "on_message": "https://your-server.com/webhook/message",
    "on_response": "https://your-server.com/webhook/response",
    "on_complete": "https://your-server.com/webhook/complete",
    "on_error": "https://your-server.com/webhook/error"
  }
}
```

### Webhook Security

All webhooks include a signature header:
```
X-AbetWorks-Signature: sha256=abc123...
```

**Verify Signature:**
```javascript
const crypto = require('crypto');

function verifyWebhook(body, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  
  return `sha256=${expected}` === signature;
}
```

---

## Tools & Capabilities

### Built-in Tools

#### 1. Memory Tool
**Purpose:** Store and recall information

**Configuration:**
```json
{
  "tools": {
    "memory": {
      "enabled": true,
      "auto_save": true,
      "recall_on_mention": true
    }
  }
}
```

**Usage in Prompt:**
```
You have access to memory. You can:
- Remember user preferences
- Recall past conversations
- Store important information
```

#### 2. Web Search Tool
**Purpose:** Search the internet

**Configuration:**
```json
{
  "tools": {
    "web_search": {
      "enabled": true,
      "provider": "google",
      "api_key": "your_api_key"
    }
  }
}
```

#### 3. File Access Tool
**Purpose:** Read/write files

**Configuration:**
```json
{
  "tools": {
    "file_access": {
      "enabled": true,
      "allowed_paths": ["/opt/abetworks/data"],
      "allowed_operations": ["read", "write"]
    }
  }
}
```

#### 4. HTTP Request Tool
**Purpose:** Make API calls

**Configuration:**
```json
{
  "tools": {
    "http_request": {
      "enabled": true,
      "allowed_domains": ["api.example.com"],
      "max_requests_per_minute": 60
    }
  }
}
```

#### 5. Database Tool
**Purpose:** Query databases

**Configuration:**
```json
{
  "tools": {
    "database": {
      "enabled": true,
      "type": "postgresql",
      "connection_string": "postgresql://...",
      "allowed_tables": ["users", "orders"]
    }
  }
}
```

#### 6. Scheduler Tool
**Purpose:** Run scheduled tasks

**Configuration:**
```json
{
  "tools": {
    "scheduler": {
      "enabled": true,
      "tasks": [
        {
          "name": "daily_report",
          "schedule": "0 9 * * *",
          "action": "send_report"
        }
      ]
    }
  }
}
```

---

## Creating Agents

### Step-by-Step Guide

#### Step 1: Define Agent Purpose
```
What will the agent do?
- Answer FAQs
- Book reservations
- Generate leads
- Provide support
- etc.
```

#### Step 2: Choose Channel
```
Where will it operate?
- WhatsApp
- Telegram
- Discord
- Slack
- Web
- Email
```

#### Step 3: Select AI Model
```
Which AI provider?
- Groq (fast, free tier)
- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude)
- OpenRouter (50+ models)
```

#### Step 4: Write System Prompt
```
Define agent behavior:
- Role and personality
- What it can/cannot do
- Response style
- Escalation rules
```

#### Step 5: Configure Tools
```
What capabilities?
- Memory: Yes/No
- Web search: Yes/No
- File access: Yes/No
- Database: Yes/No
- etc.
```

#### Step 6: Set Up Webhooks
```
Where to send events?
- on_message: URL
- on_response: URL
- on_complete: URL
- on_error: URL
```

#### Step 7: Deploy
```
Via Dashboard or API:
- Create agent config
- Start agent
- Monitor status
```

---

### Agent Templates

#### Template 1: Customer Support Agent
```json
{
  "agent_id": "support-bot",
  "type": "support",
  "channel": ["whatsapp", "telegram"],
  "model": {
    "provider": "groq",
    "model": "llama-3.3-70b-versatile"
  },
  "system_prompt": "You are a helpful customer support agent. Answer questions politely and accurately. If you don't know something, say so and offer to connect with a human.",
  "tools": {
    "memory": true,
    "web_search": false,
    "file_access": false
  },
  "webhooks": {
    "on_complete": "https://crm.com/webhook/support-complete"
  }
}
```

#### Template 2: Lead Generation Agent
```json
{
  "agent_id": "lead-gen-bot",
  "type": "lead_gen",
  "channel": ["telegram", "linkedin"],
  "model": {
    "provider": "openai",
    "model": "gpt-4-turbo"
  },
  "system_prompt": "You are a lead generation specialist. Qualify leads by asking about budget, timeline, and requirements. Collect contact information and pass qualified leads to sales team.",
  "tools": {
    "memory": true,
    "database": true,
    "http_request": true
  },
  "webhooks": {
    "on_complete": "https://crm.com/webhook/new-lead"
  }
}
```

#### Template 3: Research Agent
```json
{
  "agent_id": "research-bot",
  "type": "research",
  "channel": ["web", "email"],
  "model": {
    "provider": "anthropic",
    "model": "claude-sonnet-4"
  },
  "system_prompt": "You are a research assistant. Search for information, analyze sources, and provide comprehensive reports with citations.",
  "tools": {
    "web_search": true,
    "file_access": true,
    "scheduler": true
  },
  "webhooks": {
    "on_complete": "https://reports.com/webhook/research-complete"
  }
}
```

#### Template 4: Reservation Agent
```json
{
  "agent_id": "reservation-bot",
  "type": "reservation",
  "channel": ["whatsapp"],
  "model": {
    "provider": "groq",
    "model": "llama-3.3-70b-versatile"
  },
  "system_prompt": "You handle restaurant reservations. Collect date, time, party size, and contact info. Check availability and confirm bookings.",
  "tools": {
    "memory": true,
    "database": true,
    "scheduler": true
  },
  "webhooks": {
    "on_complete": "https://restaurant.com/webhook/reservation"
  }
}
```

---

## Channel Integration

### WhatsApp Integration

#### Setup:
1. Get WhatsApp Business API
2. Create Meta Developer account
3. Set up WhatsApp Business number
4. Get API credentials

#### Configuration:
```json
{
  "channels": {
    "whatsapp": {
      "accounts": {
        "main": {
          "phone_number": "+91-9876543210",
          "api_key": "whatsapp_api_key",
          "api_secret": "whatsapp_api_secret",
          "webhook_url": "https://api.abetworks.ai/webhook/whatsapp",
          "allow_from": ["*"]
        }
      }
    }
  }
}
```

#### Webhook Handler:
```javascript
app.post('/webhook/whatsapp', (req, res) => {
  const { from, message } = req.body;
  
  // Forward to agent
  fetch('http://localhost:3001/webhook', {
    method: 'POST',
    body: JSON.stringify({ from, message })
  });
  
  res.sendStatus(200);
});
```

---

### Telegram Integration

#### Setup:
1. Open Telegram, find @BotFather
2. Send /newbot
3. Get bot token
4. Configure webhook

#### Configuration:
```json
{
  "channels": {
    "telegram": {
      "accounts": {
        "main": {
          "bot_token": "123:ABC-DEF1234ghIkl-zyx57W2v1u123ew11",
          "webhook_url": "https://api.abetworks.ai/webhook/telegram",
          "allow_from": ["*"]
        }
      }
    }
  }
}
```

---

### Discord Integration

#### Setup:
1. Go to Discord Developer Portal
2. Create Application
3. Create Bot
4. Get bot token
5. Invite to server

#### Configuration:
```json
{
  "channels": {
    "discord": {
      "accounts": {
        "main": {
          "bot_token": "discord_bot_token",
          "guild_id": "server_id",
          "allow_from": ["*"]
        }
      }
    }
  }
}
```

---

## Deployment

### Local Development

```bash
# 1. Set up environment
export NULLCLAW_PATH="/path/to/nullclaw"
export ABETWORKS_CONFIG="/path/to/config"

# 2. Create customer
./agent-manager.sh new_customer create

# 3. Create agents
./agent-manager.sh new_customer create
# Follow prompts

# 4. Start agents
./agent-manager.sh new_customer start

# 5. Monitor
./agent-manager.sh new_customer status
```

### Production Deployment

#### Single Server (1-50 customers):
```bash
# Install dependencies
apt update && apt upgrade -y
apt install -y nodejs npm postgresql

# Install nullclaw
cd /tmp
curl -LO https://ziglang.org/download/0.15.2/zig-x86_64-linux-0.15.2.tar.xz
tar -xf zig-x86_64-linux-0.15.2.tar.xz
mv zig-0.15.2 /opt/zig
echo 'export PATH="/opt/zig:$PATH"' >> ~/.bashrc

# Build nullclaw
git clone https://github.com/nullclaw/nullclaw.git
cd nullclaw
zig build
cp zig-out/bin/nullclaw /usr/local/bin/

# Set up systemd service
cat > /etc/systemd/system/abetworks.service << EOF
[Unit]
Description=AbetWorks Agent Fleet
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/nullclaw gateway
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl enable abetworks
systemctl start abetworks
```

#### Multi-Server (50+ customers):
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    image: abetworks/frontend:latest
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgresql://...
  
  api:
    image: abetworks/api:latest
    ports:
      - "3000:3000"
  
  agents:
    deploy:
      replicas: 10
    image: abetworks/agent:latest
  
  postgres:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

---

## Monitoring & Debugging

### Agent Logs

#### Location:
```
/opt/abetworks/customers/{customer_id}/logs/
├── {agent_id}.log
└── {agent_id}.error.log
```

#### View Logs:
```bash
# Real-time
tail -f /opt/abetworks/customers/taj_restaurant/logs/support-bot.log

# Last 100 lines
tail -n 100 /opt/abetworks/customers/taj_restaurant/logs/faq-bot.log

# Search errors
grep "ERROR" /opt/abetworks/customers/taj_restaurant/logs/*.log
```

### Health Checks

#### Check Agent Health:
```bash
curl http://localhost:3001/health
```

#### Check All Agents:
```bash
./agent-manager.sh {customer_id} status
```

### Debugging Tips

#### 1. Agent Not Responding
```bash
# Check if running
ps aux | grep nullclaw

# Check logs
tail -f /opt/abetworks/customers/{customer_id}/logs/{agent_id}.log

# Restart agent
./agent-manager.sh {customer_id} restart
```

#### 2. High Error Rate
```bash
# Check error logs
grep "ERROR" /opt/abetworks/customers/{customer_id}/logs/*.log | tail -20

# Check API quota
curl -H "Authorization: Bearer {api_key}" \
  https://api.groq.com/openai/v1/usage
```

#### 3. Memory Issues
```bash
# Check memory usage
ps aux | grep nullclaw | awk '{print $6}'

# Restart if needed
pkill -f nullclaw
./agent-manager.sh {customer_id} start
```

---

## Examples

### Example 1: Deploy Restaurant Bot

```bash
# Create customer
curl -X POST http://localhost:8080/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Taj Mahal Restaurant",
    "email": "contact@taj.com",
    "business_type": "restaurant"
  }'

# Create reservation agent
curl -X POST http://localhost:8080/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "taj_restaurant",
    "agent_id": "reservation-bot",
    "type": "reservation",
    "channel": "whatsapp",
    "model": {
      "provider": "groq",
      "api_key": "gsk_..."
    },
    "system_prompt": "You handle restaurant reservations..."
  }'

# Start agent
curl -X POST http://localhost:8080/api/agents/taj_restaurant/reservation-bot/start

# Check status
curl http://localhost:8080/api/agents/taj_restaurant/reservation-bot/status
```

### Example 2: Deploy E-commerce Support

```bash
# Create customer
./agent-manager.sh fashion_hub create

# Create 3 agents:
# 1. Support Bot (WhatsApp)
# 2. Sales Bot (Telegram)
# 3. Order Tracker (Web)

# Start all
./agent-manager.sh fashion_hub start
```

---

## SDK Reference

### JavaScript SDK

```javascript
const AbetWorks = require('abetworks-sdk');

const client = new AbetWorks({
  apiKey: 'your_api_key',
  baseUrl: 'https://api.abetworks.ai/v1'
});

// Create agent
const agent = await client.agents.create({
  customer_id: 'taj_restaurant',
  agent_id: 'reservation-bot',
  type: 'reservation',
  channel: 'whatsapp',
  model: { provider: 'groq' },
  system_prompt: 'You handle reservations...'
});

// Send message
const response = await client.messages.send({
  customer_id: 'taj_restaurant',
  agent_id: 'reservation-bot',
  from: '+91-9876543210',
  message: 'Book table for 4'
});

// Get analytics
const analytics = await client.analytics.getAgent('taj_restaurant', 'reservation-bot');
```

### Python SDK

```python
from abetworks import AbetWorksClient

client = AbetWorksClient(
    api_key='your_api_key',
    base_url='https://api.abetworks.ai/v1'
)

# Create agent
agent = client.agents.create(
    customer_id='taj_restaurant',
    agent_id='reservation-bot',
    type='reservation',
    channel='whatsapp',
    model={'provider': 'groq'},
    system_prompt='You handle reservations...'
)

# Send message
response = client.messages.send(
    customer_id='taj_restaurant',
    agent_id='reservation-bot',
    from_='+91-9876543210',
    message='Book table for 4'
)

# Get analytics
analytics = client.analytics.get_agent('taj_restaurant', 'reservation-bot')
```

---

**This is your complete guide to creating unlimited agents!** 🚀

For more help: docs@abetworks.ai
