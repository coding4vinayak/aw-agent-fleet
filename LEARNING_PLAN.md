# Nullclaw Agent Learning Plan

## Goal: Build One Agent First, Then Scale to Fleet

This plan focuses on **learning by building** - start with a single agent, understand all components, then scale.

---

## Phase 1: Foundation (Week 1-2)

### What You'll Learn
- How nullclaw works internally
- AI provider integration
- Basic configuration
- Memory/storage fundamentals

### Steps

#### 1. Install Zig 0.15.2 (Required Version)

```bash
# Check if you have zig installed
zig version

# Install via package manager (Linux)
curl -fsSL https://ziglang.org/install.sh | bash

# Or download directly
wget https://ziglang.org/download/0.15.2/zig-linux-x86_64-0.15.2.tar.xz
tar -xf zig-linux-x86_64-0.15.2.tar.xz
sudo cp -r zig-linux-x86_64-0.15.2 /usr/local/lib/zig
echo 'export PATH="$PATH:/usr/local/lib/zig"' >> ~/.bashrc
source ~/.bashrc

# Verify
zig version  # Should show: 0.15.2
```

#### 2. Build Nullclaw

```bash
cd nullclaw-repo

# Dev build
zig build

# Release build (optimized, small binary)
zig build -Doptimize=ReleaseSmall

# Run tests
zig build test --summary all
```

#### 3. Quick Setup - Your First Agent

```bash
# Interactive onboarding (recommended)
./zig-out/bin/nullclaw onboard --interactive

# Or quick setup with API key
./zig-out/bin/nullclaw onboard --api-key sk-your-key --provider openrouter

# Test it
./zig-out/bin/nullclaw agent -m "Hello, nullclaw!"
```

#### 4. Key Configuration Areas

Edit `~/.nullclaw/config.json`:

```json
{
  // 1. AI MODEL PROVIDER
  "models": {
    "providers": {
      "openrouter": { "api_key": "sk-or-..." }
    }
  },
  
  // 2. DEFAULT AGENT MODEL
  "agents": {
    "defaults": {
      "model": { "primary": "openrouter/anthropic/claude-sonnet-4" }
    }
  },
  
  // 3. MEMORY/STORAGE
  "memory": {
    "backend": "sqlite",        // or "markdown"
    "auto_save": true,
    "embedding_provider": "openai",
    "vector_weight": 0.7,
    "keyword_weight": 0.3
  },
  
  // 4. SECURITY
  "autonomy": {
    "level": "supervised",      // supervised | full
    "workspace_only": true,
    "max_actions_per_hour": 20
  }
}
```

---

## Phase 2: Storage & Memory Deep Dive (Week 2-3)

### Key Concepts

Nullclaw has a **hybrid memory system**:

| Layer | What It Does | Storage |
|-------|-------------|---------|
| **Vector DB** | Semantic search via embeddings | SQLite BLOB |
| **Keyword Search** | Full-text search (FTS5) | SQLite virtual tables |
| **Hybrid Merge** | Combines both with weights | Configurable |

### Memory Configuration

```json
{
  "memory": {
    "backend": "sqlite",
    "auto_save": true,
    "embedding_provider": "openai",
    
    // Hybrid search weights
    "vector_weight": 0.7,
    "keyword_weight": 0.3,
    
    // Lifecycle management
    "hygiene_enabled": true,
    "archive_after_days": 7,
    "purge_after_days": 30,
    
    // Embedding settings
    "search": {
      "model": "text-embedding-3-small",
      "dimensions": 1536,
      "chunking": {
        "max_tokens": 512,
        "overlap": 64
      }
    }
  }
}
```

### Storage Files Location

```
~/.nullclaw/
├── config.json          # Main configuration
├── memory.db            # SQLite database
├── memory/              # Markdown backups (if enabled)
├── secrets/             # Encrypted API keys
└── logs/                # Audit logs
```

### Hands-On Exercises

1. **Test memory save/recall:**
   ```bash
   # Chat with agent
   ./zig-out/bin/nullclaw agent -m "Remember: My favorite color is blue"
   
   # Ask it to recall
   ./zig-out/bin/nullclaw agent -m "What's my favorite color?"
   ```

2. **Inspect SQLite database:**
   ```bash
   sqlite3 ~/.nullclaw/memory.db ".tables"
   sqlite3 ~/.nullclaw/memory.db "SELECT * FROM memories LIMIT 5;"
   ```

3. **Export/Import memory:**
   ```bash
   ./zig-out/bin/nullclaw memory export backup.json
   ./zig-out/bin/nullclaw memory import backup.json
   ```

---

## Phase 3: Connect One Channel (Week 3-4)

### Choose Your First Channel

**Recommended: Telegram** (easiest setup)

#### Step 1: Create Telegram Bot

1. Open Telegram, search for `@BotFather`
2. Send `/newbot`
3. Follow prompts, get your **BOT TOKEN**
4. Get your **USER ID**: search `@userinfobot`, send any message

#### Step 2: Configure

```json
{
  "channels": {
    "telegram": {
      "accounts": {
        "main": {
          "bot_token": "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11",
          "allow_from": ["YOUR_TELEGRAM_USER_ID"]
        }
      }
    }
  }
}
```

#### Step 3: Start Channel

```bash
# Check channel status
./zig-out/bin/nullclaw channel status

# Start Telegram
./zig-out/bin/nullclaw channel start telegram

# Or start gateway (runs all channels)
./zig-out/bin/nullclaw gateway
```

### Alternative: Discord

```json
{
  "channels": {
    "discord": {
      "accounts": {
        "main": {
          "token": "discord-bot-token",
          "guild_id": "your-server-id",
          "allow_from": ["user-id"]
        }
      }
    }
  }
}
```

---

## Phase 4: Add Tools (Week 4-5)

### Built-in Tools

Nullclaw comes with 18+ tools:

| Tool | What It Does |
|------|-------------|
| `shell` | Execute shell commands |
| `file_read` | Read files |
| `file_write` | Write files |
| `file_edit` | Edit files |
| `memory_store` | Save to memory |
| `memory_recall` | Recall from memory |
| `http_request` | Make HTTP calls |
| `browser_open` | Open URLs |
| `screenshot` | Take screenshots |

### Enable Tools in Config

```json
{
  "tools": {
    "shell": {
      "enabled": true,
      "allowed_commands": ["ls", "cat", "pwd", "echo"]
    },
    "http_request": {
      "enabled": true
    }
  }
}
```

### Test Tools

```bash
# Ask agent to use tools
./zig-out/bin/nullclaw agent -m "What files are in the current directory?"
./zig-out/bin/nullclaw agent -m "Read the file main.py"
```

---

## Phase 5: Production Setup (Week 5-6)

### Run as Background Service

```bash
# Install as system service
./zig-out/bin/nullclaw service install

# Check status
./zig-out/bin/nullclaw service status

# Start/Stop
./zig-out/bin/nullclaw service start
./zig-out/bin/nullclaw service stop
```

### Deploy to VPS

```bash
# On your VPS (DigitalOcean, Hetzner, etc.)

# 1. Copy binary
scp zig-out/bin/nullclaw user@your-vps:/usr/local/bin/

# 2. Copy config
scp ~/.nullclaw/config.json user@your-vps:~/.nullclaw/

# 3. SSH and install
ssh user@your-vps
sudo cp nullclaw /usr/local/bin/
nullclaw service install
```

### Docker Deployment

```bash
# Build Docker image
docker build -t nullclaw .

# Run with docker-compose
docker-compose up -d
```

---

## Key Learnings Checklist

### Storage & Memory
- [ ] Understand SQLite vs Markdown backend
- [ ] Configure hybrid search (vector + keyword)
- [ ] Set up embedding generation
- [ ] Test memory export/import
- [ ] Configure hygiene (auto-archive/purge)

### Model Management
- [ ] Configure primary AI provider
- [ ] Set up fallback providers
- [ ] Understand temperature settings
- [ ] Test different models (Claude, GPT, etc.)

### Tools & Capabilities
- [ ] Enable shell access (with restrictions)
- [ ] Configure file tools
- [ ] Set up HTTP requests
- [ ] Test tool execution flow

### Channels
- [ ] Connect Telegram/Discord
- [ ] Configure allowlists
- [ ] Test message routing
- [ ] Handle multi-user scenarios

### Security
- [ ] Enable pairing
- [ ] Configure sandbox
- [ ] Set resource limits
- [ ] Enable audit logging

---

## Common Issues & Solutions

### Issue: Binary won't build
```bash
# Ensure Zig 0.15.2
zig version

# Clean build
rm -rf zig-out zig-cache
zig build
```

### Issue: Memory not saving
```json
// Check config
{
  "memory": {
    "auto_save": true,
    "backend": "sqlite"
  }
}
```

### Issue: Channel not receiving messages
```bash
# Check allowlist
# Empty allowlist = deny all
# "*" = allow all
# ["user1", "user2"] = specific users

# Check channel status
./zig-out/bin/nullclaw channel status
```

---

## Next: Scaling to Fleet

Once you master one agent, scaling involves:

1. **Multiple Agent Configs** - Define agents in `agents.list`
2. **Shared Memory** - Use same SQLite DB or external (Redis/Postgres)
3. **Load Balancing** - Gateway routes to different agents
4. **Subagents** - Parent agent delegates tasks

Example multi-agent config:

```json
{
  "agents": {
    "list": [
      {
        "id": "support",
        "model": { "primary": "openrouter/claude-sonnet" },
        "system_prompt": "You handle customer support"
      },
      {
        "id": "research",
        "model": { "primary": "openrouter/claude-opus" },
        "system_prompt": "You do deep research"
      }
    ]
  }
}
```

---

## Resources

- **Docs:** https://nullclaw.github.io
- **GitHub:** https://github.com/nullclaw/nullclaw
- **Config Example:** `nullclaw-repo/config.example.json`
- **Agent Protocol:** `nullclaw-repo/AGENTS.md`

---

## Start Here Today

```bash
# 1. Install Zig
curl -fsSL https://ziglang.org/install.sh | bash

# 2. Build nullclaw
cd nullclaw-repo
zig build

# 3. Quick test
./zig-out/bin/nullclaw --help

# 4. Onboard
./zig-out/bin/nullclaw onboard --interactive
```

**First goal:** Get `./zig-out/bin/nullclaw agent -m "Hello"` working.
**Second goal:** Connect Telegram and message your agent.
**Third goal:** Understand where messages are stored (SQLite).
