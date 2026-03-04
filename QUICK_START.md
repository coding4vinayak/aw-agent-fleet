# Quick Start: Your First Nullclaw Agent

## Immediate Action Plan

### Step 1: Install Zig 0.15.2

```bash
# Download and install Zig 0.15.2
cd /tmp
wget https://ziglang.org/download/0.15.2/zig-linux-x86_64-0.15.2.tar.xz
tar -xf zig-linux-x86_64-0.15.2.tar.xz

# Add to PATH (add to ~/.bashrc for persistence)
export PATH="/tmp/zig-linux-x86_64-0.15.2:$PATH"

# Verify
zig version  # Should output: 0.15.2
```

### Step 2: Build Nullclaw

```bash
cd /teamspace/studios/this_studio/nullclaw-repo

# Build (takes 2-5 minutes first time)
zig build

# Verify build
ls -lh zig-out/bin/nullclaw

# Quick test
./zig-out/bin/nullclaw --help
./zig-out/bin/nullclaw status
```

### Step 3: Get an API Key

**Option A: OpenRouter (Recommended - access to many models)**
1. Go to https://openrouter.ai
2. Sign up, get API key
3. Models available: Claude, GPT-4, Gemini, etc.

**Option B: Direct Provider**
- OpenAI: https://platform.openai.com
- Anthropic: https://console.anthropic.com
- Groq: https://console.groq.com (free tier available!)

### Step 4: Configure Your Agent

```bash
# Run interactive onboarding
./zig-out/bin/nullclaw onboard --interactive

# Or create config manually
mkdir -p ~/.nullclaw
cat > ~/.nullclaw/config.json << 'EOF'
{
  "models": {
    "providers": {
      "groq": {
        "api_key": "gsk_your_groq_key_here"
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
    "workspace_only": true
  }
}
EOF
```

### Step 5: Test Your Agent

```bash
# Single message mode
./zig-out/bin/nullclaw agent -m "Hello! What can you do?"

# Interactive chat mode
./zig-out/bin/nullclaw agent

# Type messages, exit with /quit or Ctrl+D
```

---

## What You'll Learn First

### 1. How the Agent Loop Works

```
User Input → Agent parses → Calls LLM → Gets response → Executes tools → Returns result
```

**Try it:**
```bash
./zig-out/bin/nullclaw agent -m "What is 2+2?"
./zig-out/bin/nullclaw agent -m "List files in current directory"
```

### 2. Where Memory is Stored

```bash
# Check SQLite database
sqlite3 ~/.nullclaw/memory.db ".tables"
sqlite3 ~/.nullclaw/memory.db "SELECT * FROM conversations LIMIT 3;"

# Memory config location
cat ~/.nullclaw/config.json
```

### 3. How Tools Work

The agent can execute tools automatically:

```bash
# Ask it to use tools
./zig-out/bin/nullclaw agent -m "What's the weather in Tokyo?"
./zig-out/bin/nullclaw agent -m "Read the file /etc/hostname"
```

---

## Understanding the Core Components

### 1. Provider (AI Model Connection)

```zig
// src/providers/root.zig
// This is where AI model connections are defined
// Each provider implements: chatWithSystem(), getName(), etc.
```

**Config:**
```json
{
  "models": {
    "providers": {
      "openrouter": { "api_key": "..." },
      "groq": { "api_key": "..." },
      "anthropic": { "api_key": "..." }
    }
  }
}
```

### 2. Memory (Storage)

```zig
// src/memory/root.zig
// Implements: store(), recall(), search()
// Backends: SQLite, Markdown, PostgreSQL, Redis
```

**Config:**
```json
{
  "memory": {
    "backend": "sqlite",      // Where to store
    "auto_save": true,        // Save automatically
    "embedding_provider": "openai"  // For vector search
  }
}
```

### 3. Channel (Communication)

```zig
// src/channels/root.zig
// Implements: send(), listen(), name()
// Channels: CLI, Telegram, Discord, Slack, etc.
```

**Config:**
```json
{
  "channels": {
    "cli": true,  // Command line interface
    "telegram": {
      "accounts": {
        "main": {
          "bot_token": "...",
          "allow_from": ["user_id"]
        }
      }
    }
  }
}
```

### 4. Tools (Capabilities)

```zig
// src/tools/root.zig
// Implements: execute(), name(), description(), parameters_json
```

**Available tools:**
- `shell` - Run commands
- `file_read`, `file_write`, `file_edit`
- `memory_store`, `memory_recall`
- `http_request`
- `browser_open`
- And 12+ more

---

## First Learning Milestones

### ✅ Milestone 1: Basic Agent Running
- [ ] Zig installed and working
- [ ] Nullclaw builds successfully
- [ ] Configured with one AI provider
- [ ] Can chat via CLI: `nullclaw agent -m "Hello"`

### ✅ Milestone 2: Memory Understanding
- [ ] Know where memory is stored (`~/.nullclaw/memory.db`)
- [ ] Can inspect SQLite database
- [ ] Agent remembers previous conversations
- [ ] Understand vector vs keyword search

### ✅ Milestone 3: Tool Usage
- [ ] Agent can read files
- [ ] Agent can execute shell commands
- [ ] Understand tool permissions/sandbox
- [ ] Can see tool execution in logs

### ✅ Milestone 4: Channel Connection
- [ ] Connected Telegram or Discord
- [ ] Can message agent from app
- [ ] Understand allowlist configuration
- [ ] Agent responds correctly

---

## Troubleshooting

### Build fails
```bash
# Check Zig version
zig version  # Must be 0.15.2

# Clean and rebuild
rm -rf zig-out zig-cache
zig build
```

### "Command not found" after build
```bash
# Use full path
./zig-out/bin/nullclaw

# Or add to PATH
export PATH="$PWD/zig-out/bin:$PATH"
```

### API errors
```bash
# Check API key is correct
cat ~/.nullclaw/config.json

# Test with status command
./zig-out/bin/nullclaw status
```

### Memory not working
```bash
# Ensure SQLite backend
# Check ~/.nullclaw/config.json has:
{
  "memory": {
    "backend": "sqlite",
    "auto_save": true
  }
}
```

---

## Next Steps After First Agent

Once your first agent works:

1. **Add another channel** (Discord, Slack)
2. **Configure more tools** (HTTP requests, browser)
3. **Set up scheduling** (cron jobs)
4. **Enable gateway** (webhook API)
5. **Deploy to VPS** (production setup)

Then scale to fleet:
- Multiple agent configs
- Shared memory
- Load balancing
- Subagent delegation

---

## Key Files to Study

```
nullclaw-repo/
├── src/agent.zig           # Main agent loop
├── src/config.zig          # Configuration parsing
├── src/providers/          # AI provider implementations
├── src/channels/           # Channel implementations
├── src/tools/              # Tool implementations
├── src/memory/             # Memory backend implementations
└── config.example.json     # Full config reference
```

Start with `src/agent.zig` to understand the core loop!
