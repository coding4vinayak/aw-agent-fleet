# First Agent: Step-by-Step Guide

## Today's Goal: Get Your Agent Running

Follow these exact steps. Don't skip ahead.

---

## Step 1: Install Zig (5 minutes)

```bash
# Go to temp directory
cd /tmp

# Download Zig 0.15.2 (exact version required)
wget https://ziglang.org/download/0.15.2/zig-linux-x86_64-0.15.2.tar.xz

# Extract
tar -xf zig-linux-x86_64-0.15.2.tar.xz

# Add to PATH for this session
export PATH="/tmp/zig-linux-x86_64-0.15.2:$PATH"

# Verify installation
zig version
```

**Expected output:** `0.15.2`

**If it fails:**
- Check your internet connection
- Try the download again
- Make sure you're on Linux x86_64 (most common)

---

## Step 2: Build Nullclaw (5-10 minutes)

```bash
# Go to nullclaw directory
cd /teamspace/studios/this_studio/nullclaw-repo

# Build (first time takes longest)
zig build

# Watch it compile... this creates the binary
```

**Wait for it to finish.** You'll see compilation progress.

**Verify build:**
```bash
ls -lh zig-out/bin/nullclaw
./zig-out/bin/nullclaw --help
```

**Expected:** See command help output

---

## Step 3: Get a FREE API Key (3 minutes)

### Option A: Groq (Fastest, Free Tier)

1. Go to https://console.groq.com
2. Sign up (Google/GitHub)
3. Go to "Keys" tab
4. Click "Create API Key"
5. Copy the key (starts with `gsk_`)

**Free limits:**
- 30 requests per minute
- Llama 3.1 70B model (excellent)
- Perfect for learning

### Option B: OpenRouter (More Models)

1. Go to https://openrouter.ai
2. Sign up
3. Get API key (starts with `sk-or-`)
4. Add $1 credit to start

**Why OpenRouter:** Access to Claude, GPT-4, etc.

---

## Step 4: Configure Your Agent (2 minutes)

```bash
# Create config directory
mkdir -p ~/.nullclaw

# Create config file with your API key
cat > ~/.nullclaw/config.json << EOF
{
  "models": {
    "providers": {
      "groq": {
        "api_key": "PASTE_YOUR_GROQ_KEY_HERE"
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "groq/llama-3.1-70b-versatile"
      }
    }
  },
  "memory": {
    "backend": "sqlite",
    "auto_save": true
  },
  "autonomy": {
    "level": "supervised",
    "workspace_only": true,
    "max_actions_per_hour": 50
  }
}
EOF
```

**Edit the file:**
```bash
nano ~/.nullclaw/config.json
```

Replace `PASTE_YOUR_GROQ_KEY_HERE` with your actual key.

---

## Step 5: Test Your Agent (1 minute)

```bash
# Make sure PATH includes zig
export PATH="/tmp/zig-linux-x86_64-0.15.2:$PATH"

# Go to nullclaw directory
cd /teamspace/studios/this_studio/nullclaw-repo

# Test with a simple message
./zig-out/bin/nullclaw agent -m "Hello! What is 2+2?"
```

**Expected output:**
```
Agent: Hello! 2+2 equals 4. How can I help you today?
```

**If it works:** 🎉 You have a working AI agent!

**If it fails:**
- Check your API key is correct
- Check internet connection
- Run `./zig-out/bin/nullclaw status` for diagnostics

---

## Step 6: Try More Commands (5 minutes)

### Basic Chat
```bash
./zig-out/bin/nullclaw agent -m "What can you do?"
./zig-out/bin/nullclaw agent -m "Explain quantum computing in one sentence"
```

### With Memory
```bash
# Save a memory
./zig-out/bin/nullclaw agent -m "Remember: My name is Alex and I like pizza"

# Recall it
./zig-out/bin/nullclaw agent -m "What's my name and what do I like?"
```

### File Operations
```bash
# Read a file
./zig-out/bin/nullclaw agent -m "Read the file main.py"

# List directory
./zig-out/bin/nullclaw agent -m "What files are in /teamspace/studios/this_studio?"
```

---

## Step 7: Inspect Storage (3 minutes)

### Check SQLite Database
```bash
# See what tables exist
sqlite3 ~/.nullclaw/memory.db ".tables"

# View conversations
sqlite3 ~/.nullclaw/memory.db "SELECT id, role, content FROM conversations ORDER BY id DESC LIMIT 5;"

# View memories
sqlite3 ~/.nullclaw/memory.db "SELECT id, content FROM memories ORDER BY id DESC LIMIT 5;"
```

### Check Config
```bash
cat ~/.nullclaw/config.json
```

### Check Logs
```bash
ls -la ~/.nullclaw/logs/
```

---

## Step 8: Interactive Mode (5 minutes)

```bash
# Start interactive chat
./zig-out/bin/nullclaw agent
```

**Now you can chat:**
```
> Tell me a joke
> What's the weather like?
> Can you help me write code?
> /quit   (to exit)
```

---

## What You've Learned So Far

✅ **How to build nullclaw** - Zig compilation process
✅ **How to configure** - JSON config with API keys
✅ **How agent works** - Input → LLM → Output
✅ **How memory works** - SQLite storage at `~/.nullclaw/memory.db`
✅ **How to test** - CLI commands and interactive mode

---

## Tomorrow: Add a Communication Channel

### Choose One:

**Telegram (Easiest)**
1. Open Telegram, find `@BotFather`
2. Send `/newbot`
3. Get your bot token
4. Add to config:
```json
{
  "channels": {
    "telegram": {
      "accounts": {
        "main": {
          "bot_token": "YOUR_BOT_TOKEN",
          "allow_from": ["YOUR_USER_ID"]
        }
      }
    }
  }
}
```
5. Start: `./zig-out/bin/nullclaw channel start telegram`

**Discord**
1. Go to https://discord.com/developers
2. Create application → Bot
3. Copy token
4. Add to config similar to above

---

## Day After: Enable Tools

Add to config:
```json
{
  "tools": {
    "shell": {
      "enabled": true,
      "allowed_commands": ["ls", "cat", "pwd", "echo", "whoami"]
    },
    "http_request": {
      "enabled": true
    }
  }
}
```

Test:
```bash
./zig-out/bin/nullclaw agent -m "What's my username?"
./zig-out/bin/nullclaw agent -m "Make a GET request to example.com"
```

---

## Common Issues & Fixes

### "zig: command not found"
```bash
export PATH="/tmp/zig-linux-x86_64-0.15.2:$PATH"
```

### "API key invalid"
- Double-check your API key in `~/.nullclaw/config.json`
- Make sure no extra spaces
- Test with curl: `curl -H "Authorization: Bearer gsk_..." https://api.groq.com/openai/v1/models`

### Build fails
```bash
# Clean and rebuild
rm -rf zig-out zig-cache
zig build
```

### "Cannot connect to API"
- Check internet connection
- Check firewall settings
- Try different provider (Groq vs OpenRouter)

---

## Success Checklist

### Day 1 (Today)
- [ ] Zig 0.15.2 installed
- [ ] Nullclaw builds successfully
- [ ] API key configured
- [ ] `nullclaw agent -m "Hello"` works
- [ ] Memory storage verified in SQLite

### Day 2
- [ ] Telegram channel connected
- [ ] Can message agent from phone
- [ ] Agent responds correctly

### Day 3
- [ ] Shell tools enabled
- [ ] Agent can read files
- [ ] Agent can execute commands
- [ ] Security allowlists configured

### Day 4-5
- [ ] Understand memory system
- [ ] Can export/import memories
- [ ] Understand vector vs keyword search
- [ ] Configured embeddings (optional)

### Week 2
- [ ] Deployed to VPS
- [ ] Running as background service
- [ ] Multiple agents configured
- [ ] Planning fleet architecture

---

## Key Commands Reference

```bash
# Build
zig build
zig build -Doptimize=ReleaseSmall

# Test
./zig-out/bin/nullclaw agent -m "message"
./zig-out/bin/nullclaw agent  # interactive

# Status
./zig-out/bin/nullclaw status
./zig-out/bin/nullclaw doctor

# Channels
./zig-out/bin/nullclaw channel status
./zig-out/bin/nullclaw channel start telegram

# Service
./zig-out/bin/nullclaw service install
./zig-out/bin/nullclaw service status

# Memory
sqlite3 ~/.nullclaw/memory.db ".tables"
```

---

## What's Next?

After you complete today's steps:

1. **Understand the code** - Read `src/agent/root.zig`
2. **Add a channel** - Telegram or Discord
3. **Enable tools** - Shell, HTTP, files
4. **Deploy** - Get a VPS, run in production
5. **Scale** - Multiple agents, shared memory

---

## Resources

- **Quick Start:** `/teamspace/studios/this_studio/QUICK_START.md`
- **Learning Plan:** `/teamspace/studios/this_studio/LEARNING_PLAN.md`
- **Architecture:** `/teamspace/studios/this_studio/ARCHITECTURE_SUMMARY.md`
- **Nullclaw Repo:** `/teamspace/studios/this_studio/nullclaw-repo`
- **Official Docs:** https://nullclaw.github.io

---

## Need Help?

1. Check `./zig-out/bin/nullclaw doctor`
2. Read `nullclaw-repo/AGENTS.md`
3. Check logs in `~/.nullclaw/logs/`
4. Review config: `cat ~/.nullclaw/config.json`

**Start now:** Follow Step 1 above! 🚀
