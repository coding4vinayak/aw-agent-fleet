"use client";

import { useState, useEffect } from "react";
import { Bot, MessageSquare, Settings, Key, Database, Tool, Wifi, Play, Square, Trash2, Plus, Eye, Save, RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch config on load
  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    try {
      const res = await fetch("/api/admin/config");
      const data = await res.json();
      setConfig(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch config:", error);
      setLoading(false);
    }
  }

  async function saveConfig() {
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        showMessage("success", "Configuration saved successfully!");
      } else {
        showMessage("error", "Failed to save configuration");
      }
    } catch (error) {
      showMessage("error", "Error saving configuration");
    }
  }

  function showMessage(type, text) {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bot className="h-8 w-8 text-purple-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">AbetWorks Agent Fleet</h1>
                <p className="text-sm text-gray-400">Complete AI Agent Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-green-400 text-sm">● Gateway Online</span>
              <button onClick={fetchConfig} className="p-2 hover:bg-slate-700 rounded-lg">
                <RefreshCw className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Message Toast */}
      {message.text && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg z-50 ${
          message.type === "success" ? "bg-green-600" : "bg-red-600"
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-800 min-h-screen border-r border-slate-700">
          <nav className="p-4 space-y-2">
            <a href="/customers" className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition text-gray-400 hover:bg-slate-700 hover:text-white">
              <Users className="h-5 w-5" />
              <span className="font-medium">Customers</span>
            </a>
            <NavItem icon={<Bot />} label="Agents" active={activeTab === "agents"} onClick={() => setActiveTab("agents")} />
            <NavItem icon={<Wifi />} label="Channels" active={activeTab === "channels"} onClick={() => setActiveTab("channels")} />
            <NavItem icon={<Key />} label="API Keys" active={activeTab === "keys"} onClick={() => setActiveTab("keys")} />
            <NavItem icon={<Tool />} label="Tools" active={activeTab === "tools"} onClick={() => setActiveTab("tools")} />
            <NavItem icon={<Database />} label="Storage" active={activeTab === "storage"} onClick={() => setActiveTab("storage")} />
            <NavItem icon={<Settings />} label="Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === "agents" && <AgentsTab config={config} setConfig={setConfig} onSave={saveConfig} />}
          {activeTab === "channels" && <ChannelsTab config={config} setConfig={setConfig} onSave={saveConfig} />}
          {activeTab === "keys" && <ApiKeysTab config={config} setConfig={setConfig} onSave={saveConfig} />}
          {activeTab === "tools" && <ToolsTab config={config} setConfig={setConfig} onSave={saveConfig} />}
          {activeTab === "storage" && <StorageTab config={config} setConfig={setConfig} onSave={saveConfig} />}
          {activeTab === "settings" && <SettingsTab config={config} setConfig={setConfig} onSave={saveConfig} />}
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
        active ? "bg-purple-600 text-white" : "text-gray-400 hover:bg-slate-700 hover:text-white"
      }`}
    >
      <span className="h-5 w-5">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
// AGENTS TAB
// ═══════════════════════════════════════════════════════════════

function AgentsTab({ config, setConfig, onSave }) {
  const [showAddModal, setShowAddModal] = useState(false);

  const agents = config?.agents?.list || [];
  const defaultModel = config?.agents?.defaults?.model?.primary || "groq/llama-3.3-70b-versatile";

  function addAgent(agent) {
    const newList = [...(config.agents.list || []), agent];
    setConfig({ ...config, agents: { ...config.agents, list: newList } });
    setShowAddModal(false);
  }

  function deleteAgent(index) {
    const newList = config.agents.list.filter((_, i) => i !== index);
    setConfig({ ...config, agents: { ...config.agents, list: newList } });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">AI Agents</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Agent</span>
        </button>
      </div>

      <div className="grid gap-4">
        {agents.map((agent, index) => (
          <AgentCard key={index} agent={agent} index={index} onDelete={deleteAgent} defaultModel={defaultModel} />
        ))}
        {agents.length === 0 && (
          <div className="text-center py-12 bg-slate-800 rounded-lg">
            <Bot className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No agents configured. Create your first agent!</p>
          </div>
        )}
      </div>

      {showAddModal && <AddAgentModal onClose={() => setShowAddModal(false)} onAdd={addAgent} defaultModel={defaultModel} />}
    </div>
  );
}

function AgentCard({ agent, index, onDelete, defaultModel }) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-lg bg-purple-600 flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{agent.id || "Unnamed Agent"}</h3>
            <p className="text-gray-400 text-sm">{agent.model?.primary || defaultModel}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Active</span>
          <button onClick={() => onDelete(index)} className="p-2 hover:bg-red-500/20 rounded-lg">
            <Trash2 className="h-5 w-5 text-red-400" />
          </button>
        </div>
      </div>
      {agent.system_prompt && (
        <div className="mt-4 p-3 bg-slate-700 rounded-lg">
          <p className="text-gray-300 text-sm">{agent.system_prompt}</p>
        </div>
      )}
    </div>
  );
}

function AddAgentModal({ onClose, onAdd, defaultModel }) {
  const [formData, setFormData] = useState({
    id: "",
    customer_id: "",
    type: "support",
    channel: "whatsapp",
    model: { provider: "groq", model: "llama-3.3-70b-versatile" },
    system_prompt: "",
    api_key: "",
  });
  const [step, setStep] = useState(1);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full p-6">
        <h3 className="text-xl font-bold text-white mb-2">Deploy New AI Agent</h3>
        <p className="text-gray-400 text-sm mb-4">Step {step} of 3</p>
        
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">Customer ID</label>
              <input
                type="text"
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                placeholder="e.g., taj_restaurant_20260304"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Agent ID</label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                placeholder="e.g., support-bot, lead-gen, faq-assistant"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Agent Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
              >
                <option value="support">Customer Support</option>
                <option value="sales">Sales Assistant</option>
                <option value="lead_gen">Lead Generation</option>
                <option value="faq">FAQ Assistant</option>
                <option value="research">Research Agent</option>
                <option value="reservation">Reservation Bot</option>
              </select>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">Communication Channel</label>
              <select
                value={formData.channel}
                onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="telegram">Telegram</option>
                <option value="discord">Discord</option>
                <option value="slack">Slack</option>
                <option value="web">Web Widget</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">AI Provider</label>
              <select
                value={formData.model.provider}
                onChange={(e) => setFormData({ ...formData, model: { ...formData.model, provider: e.target.value } })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
              >
                <option value="groq">Groq (Fast & Free)</option>
                <option value="openrouter">OpenRouter (50+ models)</option>
                <option value="anthropic">Anthropic (Claude)</option>
                <option value="openai">OpenAI (GPT)</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">API Key</label>
              <input
                type="password"
                value={formData.api_key}
                onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                placeholder="Enter API key for selected provider"
              />
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={() => setStep(1)} className="px-4 py-2 text-gray-400 hover:text-white">
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">System Prompt</label>
              <textarea
                value={formData.system_prompt}
                onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white h-40"
                placeholder="You are a helpful customer support agent for a restaurant. Help customers book tables, answer menu questions, and provide business hours. Be friendly and professional."
              />
            </div>

            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Summary</h4>
              <p className="text-gray-400 text-sm">Customer: {formData.customer_id}</p>
              <p className="text-gray-400 text-sm">Agent: {formData.id}</p>
              <p className="text-gray-400 text-sm">Type: {formData.type}</p>
              <p className="text-gray-400 text-sm">Channel: {formData.channel}</p>
              <p className="text-gray-400 text-sm">Model: {formData.model.provider}</p>
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={() => setStep(2)} className="px-4 py-2 text-gray-400 hover:text-white">
                Back
              </button>
              <button
                onClick={() => {
                  onAdd(formData);
                  onClose();
                }}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                Deploy Agent
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CHANNELS TAB
// ═══════════════════════════════════════════════════════════════

function ChannelsTab({ config, setConfig, onSave }) {
  const channels = config?.channels || {};

  function toggleChannel(channel, enabled) {
    if (channel === "cli") {
      setConfig({ ...config, channels: { ...config.channels, cli: enabled } });
    }
  }

  function updateChannelConfig(channel, key, value) {
    setConfig({
      ...config,
      channels: {
        ...config.channels,
        [channel]: {
          ...config.channels[channel],
          accounts: {
            ...config.channels[channel]?.accounts,
            [key]: value,
          },
        },
      },
    });
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Communication Channels</h2>

      <div className="grid gap-6">
        {/* CLI Channel */}
        <ChannelCard
          name="CLI"
          icon={<MessageSquare />}
          enabled={channels.cli || false}
          onToggle={(v) => toggleChannel("cli", v)}
          description="Command-line interface"
        />

        {/* Telegram */}
        <ChannelCard
          name="Telegram"
          icon={<Wifi />}
          enabled={!!channels.telegram?.accounts?.main}
          onToggle={() => {}}
          description="Telegram bot messaging"
          config={channels.telegram}
          onUpdate={(key, value) => updateChannelConfig("telegram", key, value)}
        />

        {/* Discord */}
        <ChannelCard
          name="Discord"
          icon={<Wifi />}
          enabled={!!channels.discord?.accounts?.main}
          onToggle={() => {}}
          description="Discord bot messaging"
          config={channels.discord}
          onUpdate={(key, value) => updateChannelConfig("discord", key, value)}
        />

        {/* WhatsApp */}
        <ChannelCard
          name="WhatsApp"
          icon={<Wifi />}
          enabled={!!channels.whatsapp?.accounts?.main}
          onToggle={() => {}}
          description="WhatsApp Business API"
          config={channels.whatsapp}
          onUpdate={(key, value) => updateChannelConfig("whatsapp", key, value)}
        />

        {/* Slack */}
        <ChannelCard
          name="Slack"
          icon={<Wifi />}
          enabled={!!channels.slack?.accounts?.main}
          onToggle={() => {}}
          description="Slack bot integration"
          config={channels.slack}
          onUpdate={(key, value) => updateChannelConfig("slack", key, value)}
        />
      </div>
    </div>
  );
}

function ChannelCard({ name, icon, enabled, onToggle, description, config, onUpdate }) {
  const [showConfig, setShowConfig] = useState(false);

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{name}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
          >
            Configure
          </button>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={enabled} onChange={(e) => onToggle(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>

      {showConfig && config && (
        <div className="mt-4 p-4 bg-slate-700 rounded-lg space-y-3">
          <div>
            <label className="block text-white text-sm mb-1">Bot Token</label>
            <input
              type="password"
              defaultValue={config.accounts?.main?.bot_token || ""}
              onChange={(e) => onUpdate("bot_token", e.target.value)}
              className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white"
              placeholder="Enter bot token"
            />
          </div>
          <div>
            <label className="block text-white text-sm mb-1">Allowed Users (comma-separated)</label>
            <input
              type="text"
              defaultValue={config.accounts?.main?.allow_from?.join(", ") || ""}
              onChange={(e) => onUpdate("allow_from", e.target.value.split(",").map(s => s.trim()))}
              className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white"
              placeholder="user1, user2"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// API KEYS TAB
// ═══════════════════════════════════════════════════════════════

function ApiKeysTab({ config, setConfig, onSave }) {
  const providers = config?.models?.providers || {};

  function updateApiKey(provider, key) {
    setConfig({
      ...config,
      models: {
        ...config.models,
        providers: {
          ...config.models.providers,
          [provider]: {
            ...config.models.providers[provider],
            api_key: key,
          },
        },
      },
    });
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">API Keys Management</h2>

      <div className="grid gap-6">
        <ApiKeyCard
          name="Groq"
          provider="groq"
          apiKey={providers.groq?.api_key || ""}
          onUpdate={(key) => updateApiKey("groq", key)}
          baseUrl="https://api.groq.com/openai/v1"
          models={["llama-3.3-70b-versatile", "llama-3.1-8b-instant"]}
        />

        <ApiKeyCard
          name="OpenRouter"
          provider="openrouter"
          apiKey={providers.openrouter?.api_key || ""}
          onUpdate={(key) => updateApiKey("openrouter", key)}
          baseUrl="https://openrouter.ai/api/v1"
          models={["anthropic/claude-sonnet", "openai/gpt-4-turbo", "google/gemini-pro"]}
        />

        <ApiKeyCard
          name="Anthropic"
          provider="anthropic"
          apiKey={providers.anthropic?.api_key || ""}
          onUpdate={(key) => updateApiKey("anthropic", key)}
          baseUrl="https://api.anthropic.com"
          models={["claude-sonnet-4", "claude-opus-4"]}
        />

        <ApiKeyCard
          name="OpenAI"
          provider="openai"
          apiKey={providers.openai?.api_key || ""}
          onUpdate={(key) => updateApiKey("openai", key)}
          baseUrl="https://api.openai.com/v1"
          models={["gpt-4-turbo", "gpt-3.5-turbo"]}
        />
      </div>
    </div>
  );
}

function ApiKeyCard({ name, provider, apiKey, onUpdate, baseUrl, models }) {
  const [showKey, setShowKey] = useState(false);
  const [localKey, setLocalKey] = useState(apiKey);

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <p className="text-gray-400 text-sm">{baseUrl}</p>
        </div>
        {apiKey ? (
          <span className="flex items-center text-green-400">
            <CheckCircle className="h-5 w-5 mr-2" />
            Configured
          </span>
        ) : (
          <span className="flex items-center text-yellow-400">
            <AlertCircle className="h-5 w-5 mr-2" />
            Not Configured
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <input
            type={showKey ? "text" : "password"}
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
            placeholder="Enter API key"
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
          >
            <Eye className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              onUpdate(localKey);
              setShowKey(false);
            }}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white flex items-center space-x-2"
          >
            <Save className="h-5 w-5" />
            <span>Save</span>
          </button>
        </div>

        <div>
          <label className="block text-white text-sm mb-2">Available Models</label>
          <div className="flex flex-wrap gap-2">
            {models.map((model) => (
              <span key={model} className="px-3 py-1 bg-slate-700 text-gray-300 rounded-full text-sm">
                {model}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TOOLS TAB
// ═══════════════════════════════════════════════════════════════

function ToolsTab({ config, setConfig, onSave }) {
  const tools = config?.tools || {};

  function toggleTool(tool, enabled) {
    setConfig({
      ...config,
      tools: {
        ...config.tools,
        [tool]: {
          ...config.tools[tool],
          enabled,
        },
      },
    });
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Tools Configuration</h2>

      <div className="grid gap-4">
        <ToolCard
          name="Shell"
          description="Execute shell commands"
          enabled={tools.shell?.enabled || false}
          onToggle={(v) => toggleTool("shell", v)}
          risk="High"
        />

        <ToolCard
          name="File Read"
          description="Read files from filesystem"
          enabled={tools.file_read?.enabled !== false}
          onToggle={(v) => toggleTool("file_read", v)}
          risk="Low"
        />

        <ToolCard
          name="File Write"
          description="Write/create files"
          enabled={tools.file_write?.enabled !== false}
          onToggle={(v) => toggleTool("file_write", v)}
          risk="Medium"
        />

        <ToolCard
          name="HTTP Request"
          description="Make HTTP API calls"
          enabled={tools.http_request?.enabled || false}
          onToggle={(v) => toggleTool("http_request", v)}
          risk="Medium"
        />

        <ToolCard
          name="Memory Store"
          description="Save to long-term memory"
          enabled={tools.memory_store?.enabled !== false}
          onToggle={(v) => toggleTool("memory_store", v)}
          risk="Low"
        />

        <ToolCard
          name="Browser"
          description="Open URLs in browser"
          enabled={tools.browser_open?.enabled || false}
          onToggle={(v) => toggleTool("browser_open", v)}
          risk="Medium"
        />
      </div>
    </div>
  );
}

function ToolCard({ name, description, enabled, onToggle, risk }) {
  const riskColor = {
    Low: "text-green-400",
    Medium: "text-yellow-400",
    High: "text-red-400",
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
        <p className={`text-sm mt-2 ${riskColor[risk]}`}>Risk: {risk}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={enabled} onChange={(e) => onToggle(e.target.checked)} className="sr-only peer" />
        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
      </label>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STORAGE TAB
// ═══════════════════════════════════════════════════════════════

function StorageTab({ config, setConfig, onSave }) {
  const memory = config?.memory || {};

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Storage & Memory</h2>

      <div className="grid gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Memory Backend</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">Backend Type</label>
              <select
                value={memory.backend || "sqlite"}
                onChange={(e) => setConfig({ ...config, memory: { ...memory, backend: e.target.value } })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
              >
                <option value="sqlite">SQLite (Local)</option>
                <option value="markdown">Markdown Files</option>
                <option value="postgres">PostgreSQL</option>
                <option value="redis">Redis</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Auto-Save</p>
                <p className="text-gray-400 text-sm">Automatically save conversations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={memory.auto_save !== false}
                  onChange={(e) => setConfig({ ...config, memory: { ...memory, auto_save: e.target.checked } })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Hygiene</p>
                <p className="text-gray-400 text-sm">Auto-archive old memories</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={memory.hygiene_enabled || false}
                  onChange={(e) => setConfig({ ...config, memory: { ...memory, hygiene_enabled: e.target.checked } })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Archive After (Days)</label>
              <input
                type="number"
                value={memory.archive_after_days || 7}
                onChange={(e) => setConfig({ ...config, memory: { ...memory, archive_after_days: parseInt(e.target.value) } })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Purge After (Days)</label>
              <input
                type="number"
                value={memory.purge_after_days || 30}
                onChange={(e) => setConfig({ ...config, memory: { ...memory, purge_after_days: parseInt(e.target.value) } })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Storage Stats */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Storage Statistics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-400">1,234</p>
              <p className="text-gray-400 text-sm">Conversations</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">567</p>
              <p className="text-gray-400 text-sm">Memories</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">2.3 MB</p>
              <p className="text-gray-400 text-sm">Database Size</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SETTINGS TAB
// ═══════════════════════════════════════════════════════════════

function SettingsTab({ config, setConfig, onSave }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">System Settings</h2>

      <div className="grid gap-6">
        {/* Gateway Settings */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Gateway Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">Port</label>
              <input
                type="number"
                value={config.gateway?.port || 3001}
                onChange={(e) => setConfig({ ...config, gateway: { ...config.gateway, port: parseInt(e.target.value) } })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Host</label>
              <select
                value={config.gateway?.host || "127.0.0.1"}
                onChange={(e) => setConfig({ ...config, gateway: { ...config.gateway, host: e.target.value } })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
              >
                <option value="127.0.0.1">Localhost Only (127.0.0.1)</option>
                <option value="0.0.0.0">All Interfaces (0.0.0.0)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Require Pairing</p>
                <p className="text-gray-400 text-sm">Require authentication for API access</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.gateway?.require_pairing !== false}
                  onChange={(e) => setConfig({ ...config, gateway: { ...config.gateway, require_pairing: e.target.checked } })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Security & Autonomy</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">Autonomy Level</label>
              <select
                value={config.autonomy?.level || "supervised"}
                onChange={(e) => setConfig({ ...config, autonomy: { ...config.autonomy, level: e.target.value } })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
              >
                <option value="restricted">Restricted (Ask for everything)</option>
                <option value="supervised">Supervised (Ask for risky actions)</option>
                <option value="full">Full (Autonomous)</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Max Actions Per Hour</label>
              <input
                type="number"
                value={config.autonomy?.max_actions_per_hour || 50}
                onChange={(e) => setConfig({ ...config, autonomy: { ...config.autonomy, max_actions_per_hour: parseInt(e.target.value) } })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Workspace Only</p>
                <p className="text-gray-400 text-sm">Restrict file access to workspace</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.autonomy?.workspace_only !== false}
                  onChange={(e) => setConfig({ ...config, autonomy: { ...config.autonomy, workspace_only: e.target.checked } })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={onSave}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center space-x-2"
          >
            <Save className="h-5 w-5" />
            <span>Save All Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
