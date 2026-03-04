# Nullclaw Architecture Summary

## What We've Learned

### Core Architecture

Nullclaw is built on a **vtable-driven architecture** in Zig:

```
┌─────────────────────────────────────────────────────────┐
│                    AGENT LOOP                           │
│  (src/agent/root.zig - 4472 lines)                      │
│                                                         │
│  User Input → Parse → Call LLM → Execute Tools → Output│
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│   PROVIDERS   │  │   CHANNELS    │  │     TOOLS     │
│  (AI Models)  │  │  (Messaging)  │  │ (Capabilities)│
│               │  │               │  │               │
│ • OpenRouter  │  │ • CLI         │  │ • shell       │
│ • Anthropic   │  │ • Telegram    │  │ • file_read   │
│ • OpenAI      │  │ • Discord     │  │ • file_write  │
│ • Groq        │  │ • Slack       │  │ • http_request│
│ • Ollama      │  │ • WhatsApp    │  │ • memory_*    │
│ • 50+ more    │  │ • 18+ total   │  │ • 18+ total   │
└───────────────┘  └───────────────┘  └───────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │     MEMORY      │
                   │   (Storage)     │
                   │                 │
                   │ • SQLite        │
                   │ • Vector Search │
                   │ • FTS5          │
                   │ • Hybrid Merge  │
                   └─────────────────┘
```

---

## Key Components

### 1. Agent Loop (`src/agent/root.zig`)

The brain of the operation:

```zig
pub const Agent = struct {
    config: Config,
    provider: Provider,
    memory: Memory,
    tools: []const Tool,
    history: []ChatMessage,
    
    pub fn turn(self: *Agent, input: []const u8) !Response {
        // 1. Add user message to history
        // 2. Call LLM with context
        // 3. Parse tool calls
        // 4. Execute tools
        // 5. Get LLM response
        // 6. Save to memory
        // 7. Return result
    }
};
```

**Key Settings:**
- `max_tool_iterations: 25` - Max tool use attempts per message
- `max_history: 50` - Max messages before trimming
- `temperature: 0.7` - Default creativity level

---

### 2. Providers (`src/providers/root.zig`)

AI model connections - all implement the same `Provider` vtable:

```zig
pub const Provider = struct {
    ptr: *anyopaque,
    vtable: *const VTable,
    
    const VTable = struct {
        chatWithSystem: *const fn (*anyopaque, ChatRequest) !ChatResponse,
        chat: *const fn (*anyopaque, ChatRequest) !ChatResponse,
        getName: *const fn (*anyopaque) []const u8,
        deinit: *const fn (*anyopaque) void,
    };
};
```

**Config:**
```json
{
  "models": {
    "providers": {
      "openrouter": { "api_key": "sk-or-..." },
      "groq": { "api_key": "gsk_..." },
      "anthropic": { "api_key": "sk-ant-..." }
    }
  }
}
```

---

### 3. Memory System (`src/memory/root.zig`)

Hybrid storage with multiple layers:

```
┌─────────────────────────────────────┐
│         Memory Interface            │
│  store() | recall() | search()      │
└─────────────────────────────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
    ▼                   ▼
┌─────────┐       ┌─────────┐
│ Vector  │       │Keyword  │
│   DB    │       │ (FTS5)  │
│         │       │         │
│ SQLite  │       │ SQLite  │
│ BLOB    │       │ Virtual │
│         │       │ Tables  │
└─────────┘       └─────────┘
    │                   │
    └─────────┬─────────┘
              │
              ▼
      ┌───────────────┐
      │  Hybrid Merge │
      │  (weighted)   │
      │               │
      │ vector: 70%   │
      │ keyword: 30%  │
      └───────────────┘
```

**Config:**
```json
{
  "memory": {
    "backend": "sqlite",
    "auto_save": true,
    "embedding_provider": "openai",
    "vector_weight": 0.7,
    "keyword_weight": 0.3,
    "hygiene_enabled": true,
    "archive_after_days": 7,
    "purge_after_days": 30
  }
}
```

**Storage Location:**
```
~/.nullclaw/
├── config.json       # Configuration
├── memory.db         # SQLite database
├── memory/           # Markdown backups
├── secrets/          # Encrypted API keys
└── logs/             # Audit logs
```

---

### 4. Channels (`src/channels/root.zig`)

Communication interfaces - all implement `Channel` vtable:

```zig
pub const Channel = struct {
    ptr: *anyopaque,
    vtable: *const VTable,
    
    const VTable = struct {
        send: *const fn (*anyopaque, Message) !void,
        listen: *const fn (*anyopaque) !void,
        getName: *const fn (*anyopaque) []const u8,
        isConfigured: *const fn (*anyopaque) bool,
        deinit: *const fn (*anyopaque) void,
    };
};
```

**Available Channels:**
- CLI (built-in)
- Telegram
- Discord
- Slack
- WhatsApp
- Signal
- IRC
- Matrix
- Email
- Webhook
- 10+ more

**Config:**
```json
{
  "channels": {
    "telegram": {
      "accounts": {
        "main": {
          "bot_token": "123:ABC",
          "allow_from": ["user_id"]
        }
      }
    },
    "discord": {
      "accounts": {
        "main": {
          "token": "discord-token",
          "guild_id": "server-id"
        }
      }
    }
  }
}
```

---

### 5. Tools (`src/tools/root.zig`)

Capabilities the agent can use:

```zig
pub const Tool = struct {
    ptr: *anyopaque,
    vtable: *const VTable,
    
    const VTable = struct {
        execute: *const fn (*anyopaque, Params) !Result,
        name: *const fn (*anyopaque) []const u8,
        description: *const fn (*anyopaque) []const u8,
        parameters_json: *const fn (*anyopaque) []const u8,
        deinit: *const fn (*anyopaque) void,
    };
};
```

**Built-in Tools:**

| Tool | Description | Risk Level |
|------|-------------|------------|
| `shell` | Execute commands | High |
| `file_read` | Read files | Low |
| `file_write` | Write files | Medium |
| `file_edit` | Edit files | Medium |
| `memory_store` | Save to memory | Low |
| `memory_recall` | Recall memory | Low |
| `http_request` | Make HTTP calls | Medium |
| `browser_open` | Open URLs | Medium |
| `screenshot` | Take screenshots | Low |

**Config:**
```json
{
  "tools": {
    "shell": {
      "enabled": true,
      "allowed_commands": ["ls", "cat", "pwd"]
    },
    "http_request": {
      "enabled": true
    }
  }
}
```

---

## Security Model

### Layers

```
┌─────────────────────────────────────┐
│  1. Pairing (Authentication)        │
│     - 6-digit code on startup       │
│     - Bearer token exchange         │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  2. Sandbox (Execution Isolation)   │
│     - Landlock (Linux)              │
│     - Firejail                      │
│     - Bubblewrap                    │
│     - Docker                        │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  3. Workspace (Filesystem Scope)    │
│     - workspace_only: true          │
│     - Null byte injection blocked   │
│     - Symlink escape detection      │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  4. Tool Allowlists                 │
│     - allowed_commands              │
│     - allowed_paths                 │
│     - Risk-based approval           │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  5. Encrypted Secrets               │
│     - ChaCha20-Poly1305             │
│     - Local key file                │
└─────────────────────────────────────┘
```

### Autonomy Levels

```json
{
  "autonomy": {
    "level": "supervised",  // or "full" or "restricted"
    "workspace_only": true,
    "max_actions_per_hour": 20,
    "allowed_commands": ["ls", "cat", "pwd"],
    "allowed_paths": ["/home/user/workspace"],
    "require_approval_for_medium_risk": true,
    "block_high_risk_commands": true
  }
}
```

---

## Gateway API

HTTP interface for webhooks and integrations:

```
┌─────────────────────────────────────┐
│         Gateway (Port 3000)         │
│         127.0.0.1:3000              │
└─────────────────────────────────────┘
              │
    ┌─────────┼─────────┐
    │         │         │
    ▼         ▼         ▼
/health    /pair     /webhook
(GET)     (POST)     (POST)
          Code       Message
          → Token    → Response
```

**Endpoints:**

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/health` | GET | None | Health check |
| `/pair` | POST | Pairing code | Get bearer token |
| `/webhook` | POST | Bearer token | Send message |
| `/whatsapp` | GET/POST | Varies | WhatsApp webhook |

**Config:**
```json
{
  "gateway": {
    "port": 3000,
    "host": "127.0.0.1",
    "require_pairing": true
  }
}
```

---

## Commands Reference

```bash
# Setup
nullclaw onboard --interactive     # Wizard
nullclaw onboard --api-key sk-...  # Quick setup

# Chat
nullclaw agent -m "Hello"          # Single message
nullclaw agent                     # Interactive mode

# Gateway
nullclaw gateway                   # Start HTTP server
nullclaw gateway --port 8080       # Custom port

# Channels
nullclaw channel status            # Check health
nullclaw channel start telegram    # Start specific channel

# Service
nullclaw service install           # Install as daemon
nullclaw service status            # Check status
nullclaw service start|stop        # Control

# Memory
nullclaw memory export backup.json
nullclaw memory import backup.json

# Diagnostics
nullclaw status                    # System status
nullclaw doctor                    # Run diagnostics
```

---

## File Structure

```
nullclaw-repo/
├── src/
│   ├── main.zig              # Entry point
│   ├── agent.zig             # Agent loop
│   ├── agent/
│   │   ├── root.zig          # Agent core (4472 lines)
│   │   ├── dispatcher.zig    # Tool call parsing
│   │   ├── compaction.zig    # History trimming
│   │   └── prompt.zig        # System prompts
│   ├── config.zig            # Config parsing
│   ├── providers/            # AI providers (50+)
│   ├── channels/             # Channels (18+)
│   ├── tools/                # Tools (18+)
│   ├── memory/               # Memory backends
│   ├── security/             # Security layers
│   ├── gateway.zig           # HTTP server
│   ├── tunnel.zig            # Tunnel providers
│   └── runtime.zig           # Runtime adapters
├── config.example.json       # Full config example
├── .env.example              # Environment variables
└── AGENTS.md                 # Development protocol
```

---

## Deployment Options

### ✅ Works Well

| Platform | Cost | Notes |
|----------|------|-------|
| VPS (DigitalOcean, Hetzner) | $5-10/mo | Best option |
| Railway/Render/Fly.io | $5-20/mo | Container-based |
| Raspberry Pi | $35 one-time | Perfect for home |
| Local server | Free | Your laptop/desktop |

### ❌ Doesn't Work

| Platform | Why Not |
|----------|---------|
| Vercel | No long-running processes |
| Netlify | Serverless only |
| Cloudflare Workers | Too limited (WASM only) |

---

## Scaling to Fleet

Once you master one agent:

### 1. Multiple Agents Config

```json
{
  "agents": {
    "list": [
      {
        "id": "support",
        "model": { "primary": "groq/llama-3.1-70b" },
        "system_prompt": "You handle customer support"
      },
      {
        "id": "research",
        "model": { "primary": "openrouter/claude-opus" },
        "system_prompt": "You do deep research"
      },
      {
        "id": "devops",
        "model": { "primary": "groq/llama-3.1-8b" },
        "system_prompt": "You monitor servers"
      }
    ]
  }
}
```

### 2. Shared Memory

```json
{
  "memory": {
    "backend": "postgres",
    "postgres": {
      "url": "postgresql://user:pass@localhost:5432/nullclaw",
      "schema": "public",
      "table": "memories"
    }
  }
}
```

### 3. Load Balancing

```
                    ┌──────────────┐
                    │   Gateway    │
                    │  (Port 3000) │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
       ┌──────────┐ ┌──────────┐ ┌──────────┐
       │ Support  │ │ Research │ │  DevOps  │
       │  Agent   │ │  Agent   │ │  Agent   │
       └──────────┘ └──────────┘ └──────────┘
```

---

## Next Learning Steps

### Week 1: Foundation
- [ ] Install Zig 0.15.2
- [ ] Build nullclaw
- [ ] Configure one provider (Groq - free tier)
- [ ] Test CLI: `nullclaw agent -m "Hello"`

### Week 2: Memory
- [ ] Understand SQLite storage
- [ ] Inspect `~/.nullclaw/memory.db`
- [ ] Test memory recall
- [ ] Configure embedding provider

### Week 3: Channels
- [ ] Create Telegram bot
- [ ] Configure in `config.json`
- [ ] Start channel: `nullclaw channel start telegram`
- [ ] Message your agent

### Week 4: Tools
- [ ] Enable shell tool
- [ ] Configure allowed commands
- [ ] Test tool execution
- [ ] Understand security model

### Week 5: Production
- [ ] Set up VPS
- [ ] Deploy nullclaw
- [ ] Configure as service
- [ ] Connect to production database

### Week 6: Fleet Planning
- [ ] Design multi-agent architecture
- [ ] Plan shared memory strategy
- [ ] Define agent roles
- [ ] Set up monitoring

---

## Key Takeaways

1. **Binary is tiny** - 678 KB, ~1 MB RAM, boots in <8ms
2. **Vtable architecture** - All subsystems are swappable
3. **Security-first** - Sandboxed, encrypted, allowlisted
4. **Hybrid memory** - Vector + keyword search in SQLite
5. **50+ providers** - Any AI model works
6. **18+ channels** - Connect anywhere
7. **18+ tools** - Real capabilities
8. **Not for Vercel** - Needs long-running process (VPS best)

---

## Resources

- **Repo:** `/teamspace/studios/this_studio/nullclaw-repo`
- **Docs:** https://nullclaw.github.io
- **Config Example:** `nullclaw-repo/config.example.json`
- **Dev Protocol:** `nullclaw-repo/AGENTS.md`
- **Learning Plan:** `/teamspace/studios/this_studio/LEARNING_PLAN.md`
- **Quick Start:** `/teamspace/studios/this_studio/QUICK_START.md`
