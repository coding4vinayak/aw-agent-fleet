# 🚀 AbetWorks Agent Fleet - Multi-Agent Deployment Guide

## ✅ Now You Can Deploy Multiple Agents Per Customer!

---

## 🎯 How It Works

### Before (Single Agent):
```
Customer → 1 Agent → Done
```

### Now (Multiple Agents):
```
Customer → Agent 1 (Support Bot on WhatsApp)
         → Agent 2 (FAQ Bot on Telegram)
         → Agent 3 (Lead Gen on Discord)
```

---

## 📋 Step-by-Step: Deploy Multiple Agents

### Method 1: Via Dashboard (Recommended)

#### Step 1: Open Admin Dashboard
```
http://localhost:8080/admin
```

#### Step 2: Click "Agents" Tab
- See all existing agents
- Click "Add Agent" button

#### Step 3: Fill Agent Details (3 Steps)

**Step 3.1 - Basic Info:**
```
Customer ID: taj_restaurant_20260304
Agent ID: support-bot
Agent Type: Customer Support
```

**Step 3.2 - Channel & Model:**
```
Channel: WhatsApp
AI Provider: Groq
API Key: gsk_...
```

**Step 3.3 - System Prompt:**
```
You are a helpful customer support agent for 
Taj Mahal Restaurant. Help customers book tables, 
answer menu questions, and provide business hours.
```

#### Step 4: Deploy!
- Click "Deploy Agent"
- Agent config saved
- Agent starts running

#### Step 5: Add More Agents!
Repeat for each agent you want:
- FAQ Bot
- Reservation Bot
- Lead Generator
- etc.

---

### Method 2: Via Command Line

```bash
# Make script executable
chmod +x /teamspace/studios/this_studio/agent-manager.sh

# Create first agent
./agent-manager.sh taj_restaurant create
# Follow prompts to configure

# Create second agent
./agent-manager.sh taj_restaurant create
# Configure differently

# Start all agents
./agent-manager.sh taj_restaurant start

# Check status
./agent-manager.sh taj_restaurant status
```

---

## 💼 Example: Restaurant Customer

### Customer: "Taj Mahal Restaurant"

**Deploy 3 Agents:**

#### Agent 1: Reservation Bot
```json
{
  "agent_id": "reservation-bot",
  "customer_id": "taj_restaurant",
  "type": "reservation",
  "channel": "whatsapp",
  "phone": "+91-9876543210",
  "system_prompt": "You handle table reservations..."
}
```

#### Agent 2: FAQ Assistant
```json
{
  "agent_id": "faq-bot",
  "customer_id": "taj_restaurant",
  "type": "faq",
  "channel": "telegram",
  "bot_token": "123:ABC...",
  "system_prompt": "You answer FAQs about menu, hours..."
}
```

#### Agent 3: Feedback Collector
```json
{
  "agent_id": "feedback-bot",
  "customer_id": "taj_restaurant",
  "type": "feedback",
  "channel": "whatsapp",
  "system_prompt": "You collect customer feedback..."
}
```

---

## 📊 Customer Dashboard View

When customer logs in, they see:

```
┌─────────────────────────────────────────┐
│  Taj Mahal Restaurant - Agent Fleet     │
├─────────────────────────────────────────┤
│  Active Agents (3)                      │
├─────────────────────────────────────────┤
│  🤖 Reservation Bot (WhatsApp) ✅       │
│     Status: Running                     │
│     Messages: 234 today                 │
│     Port: 3001                          │
├─────────────────────────────────────────┤
│  🤖 FAQ Assistant (Telegram) ✅         │
│     Status: Running                     │
│     Messages: 156 today                 │
│     Port: 3011                          │
├─────────────────────────────────────────┤
│  🤖 Feedback Bot (WhatsApp) ✅          │
│     Status: Running                     │
│     Messages: 89 today                  │
│     Port: 3021                          │
└─────────────────────────────────────────┘
```

---

## 🔧 Technical Architecture

### File Structure
```
/opt/abetworks/customers/
├── taj_restaurant_20260304/
│   ├── agents/
│   │   ├── reservation-bot.json
│   │   ├── faq-bot.json
│   │   └── feedback-bot.json
│   ├── logs/
│   │   ├── reservation-bot.log
│   │   ├── faq-bot.log
│   │   └── feedback-bot.log
│   └── config.json (customer settings)
├── premium_properties_20260305/
│   ├── agents/
│   │   ├── lead-qualifier.json
│   │   └── viewing-scheduler.json
│   └── ...
└── ...
```

### Port Assignment
```
Customer 1:
- Agent 1: Port 3001
- Agent 2: Port 3011
- Agent 3: Port 3021

Customer 2:
- Agent 1: Port 3101
- Agent 2: Port 3111
- Agent 3: Port 3121
```

---

## 🎯 Use Cases by Industry

### 1. Restaurant (3-4 Agents)
```
✓ Reservation Bot (WhatsApp)
✓ FAQ Assistant (Telegram)
✓ Feedback Collector (WhatsApp)
✓ Menu Advisor (Web Widget)
```

### 2. Real Estate (4-5 Agents)
```
✓ Lead Qualifier (Telegram)
✓ Viewing Scheduler (WhatsApp)
✓ Property Advisor (Web)
✓ Mortgage Calculator (Web)
✓ Follow-up Bot (Email)
```

### 3. E-commerce (5-6 Agents)
```
✓ Support Bot (WhatsApp + Telegram)
✓ Sales Assistant (WhatsApp)
✓ Order Tracker (WhatsApp)
✓ Returns Processor (Web)
✓ Product Recommender (Web)
✓ Review Collector (Email)
```

### 4. Enterprise (10+ Agents)
```
✓ Department-specific bots
✓ Region-specific bots
✓ Language-specific bots
✓ Product line bots
✓ Internal support bots
✓ etc.
```

---

## 💰 Pricing by Number of Agents

### Starter Plan - ₹2,000/month
```
✓ 1 Agent
✓ 1 Channel
✓ 1,000 messages
```

### Professional Plan - ₹5,000/month
```
✓ Up to 3 Agents
✓ 2 Channels
✓ 10,000 messages
✓ Basic analytics
```

### Enterprise Plan - ₹8,000/month
```
✓ Unlimited Agents
✓ All Channels
✓ Unlimited messages
✓ Advanced analytics
✓ Priority support
```

---

## 🚀 Quick Commands

### List All Agents for Customer
```bash
./agent-manager.sh taj_restaurant list-agents
```

### Check Status
```bash
./agent-manager.sh taj_restaurant status
```

### Start All Agents
```bash
./agent-manager.sh taj_restaurant start
```

### Stop All Agents
```bash
./agent-manager.sh taj_restaurant stop
```

### Restart Specific Agent
```bash
# Stop
pkill -f "nullclaw.*reservation-bot"

# Start
nullclaw gateway --config /opt/abetworks/customers/taj_restaurant/agents/reservation-bot.json --port 3001 &
```

---

## 📈 Monitoring Multiple Agents

### Dashboard Shows:
- Total agents per customer
- Messages per agent
- Status (running/stopped)
- Port numbers
- Error rates

### Logs Location:
```
/opt/abetworks/customers/<customer_id>/logs/
├── reservation-bot.log
├── faq-bot.log
└── feedback-bot.log
```

### View Logs:
```bash
# Real-time
tail -f /opt/abetworks/customers/taj_restaurant/logs/reservation-bot.log

# Last 100 lines
tail -n 100 /opt/abetworks/customers/taj_restaurant/logs/faq-bot.log
```

---

## ✅ What You Can Do Now

1. **Deploy Multiple Agents Per Customer** ✓
2. **Different Channels Per Agent** ✓
3. **Different AI Models Per Agent** ✓
4. **Custom Prompts Per Agent** ✓
5. **Independent Monitoring** ✓
6. **Individual Start/Stop** ✓

---

## 🎉 You Now Have Full Multi-Agent Capability!

**Deploy as many agents as each customer needs!**

---

**Next:** Go to `/admin` and deploy your first multi-agent setup! 🚀
