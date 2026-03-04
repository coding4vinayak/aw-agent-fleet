# 🚀 AgentFlow Setup Guide

## Step 1: Get Your API Key (Required)

### Option A: Groq (Recommended - Free & Fast)

1. Go to: https://console.groq.com
2. Sign up with Google/GitHub
3. Click "Keys" in left sidebar
4. Click "Create API Key"
5. Copy the key (starts with `gsk_`)

**Free Limits:**
- 30 requests/minute
- Llama 3.1 70B model
- Perfect for testing!

### Option B: OpenRouter (More Models)

1. Go to: https://openrouter.ai
2. Sign up
3. Get API key (starts with `sk-or-`)
4. Add $1 credit

---

## Step 2: Configure Nullclaw

Edit the config file with your API key:

```bash
nano /teamspace/studios/this_studio/.nullclaw/config.json
```

Replace `YOUR_GROQ_API_KEY_HERE` with your actual key:

```json
{
  "models": {
    "providers": {
      "groq": {
        "api_key": "gsk_your_actual_key_here"
      }
    }
  }
}
```

---

## Step 3: Start Nullclaw Gateway

```bash
# Set up Zig PATH
export PATH="/tmp/zig-x86_64-linux-0.15.2:$PATH"

# Start nullclaw gateway
cd /teamspace/studios/this_studio/nullclaw-repo
./zig-out/bin/nullclaw gateway --port 3001
```

**Expected output:**
```
Gateway started on 127.0.0.1:3001
WebChannel listening on 127.0.0.1:32123
```

---

## Step 4: Test Nullclaw

In a new terminal:

```bash
export PATH="/tmp/zig-x86_64-linux-0.15.2:$PATH"
cd /teamspace/studios/this_studio/nullclaw-repo
./zig-out/bin/nullclaw agent -m "Hello! What is 2+2?"
```

**Expected:** AI responds with "4"

---

## Step 5: Connect Frontend

The frontend is already configured! Just update the API URL:

Edit `app/api/chat/route.ts`:

```typescript
// Change this line:
const NULLCLAW_URL = process.env.NULLCLAW_URL || 'http://127.0.0.1:3001/webhook';
```

---

## Step 6: Test Full Stack

1. **Frontend:** http://localhost:3000
2. **Dashboard:** http://localhost:3000/dashboard
3. **Nullclaw Gateway:** http://127.0.0.1:3001
4. **WebChannel WebSocket:** ws://127.0.0.1:32123/ws

---

## Quick Commands

```bash
# Check nullclaw status
./zig-out/bin/nullclaw status

# View logs
./zig-out/bin/nullclaw service status

# Stop gateway
Ctrl+C (in the gateway terminal)

# Restart frontend
cd /teamspace/studios/this_studio/ai-agent-platform
npm run dev
```

---

## Troubleshooting

### "API key invalid"
- Check your Groq key is correct
- Make sure no extra spaces in config.json

### "Gateway won't start"
- Check port 3001 is not in use
- Run `./zig-out/bin/nullclaw doctor`

### "Frontend can't connect"
- Make sure gateway is running
- Check NULLCLAW_URL in route.ts

---

## What You'll Have

```
┌─────────────────┐
│   Customer      │
│   Browser       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Your Frontend │
│   (Port 3000)   │  ← Beautiful UI
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Nullclaw      │
│   (Port 3001)   │  ← AI Engine
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Groq API      │
│   (AI Model)    │  ← Llama 3.1
└─────────────────┘
```

---

**Ready? Get your API key and follow the steps!**
