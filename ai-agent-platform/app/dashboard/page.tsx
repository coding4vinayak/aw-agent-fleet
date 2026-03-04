"use client";

import { useState } from "react";
import { Bot, MessageSquare, BarChart3, Settings, Plus, Play, Pause, Trash2, ExternalLink, Zap, Users, Clock, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const [agents, setAgents] = useState([
    { id: 1, name: "Customer Support Bot", status: "active", messages: 1234, channel: "WhatsApp", created: "2 days ago" },
    { id: 2, name: "Lead Generator", status: "active", messages: 567, channel: "Email", created: "5 days ago" },
    { id: 3, name: "Content Writer", status: "paused", messages: 89, channel: "Telegram", created: "1 week ago" },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-800 border-r border-slate-700">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <Bot className="h-8 w-8 text-purple-400" />
            <span className="text-xl font-bold text-white">AgentFlow</span>
          </div>
        </div>
        <nav className="mt-8">
          <NavItem icon={<Bot />} label="My Agents" active />
          <NavItem icon={<Plus />} label="Create Agent" onClick={() => setShowCreateModal(true)} />
          <NavItem icon={<BarChart3 />} label="Analytics" />
          <NavItem icon={<MessageSquare />} label="Conversations" />
          <NavItem icon={<Settings />} label="Settings" />
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
              U
            </div>
            <div>
              <p className="text-white font-medium">User</p>
              <p className="text-gray-400 text-sm">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Manage your AI agents and monitor performance</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Agent
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard icon={<Bot className="h-6 w-6 text-purple-400" />} label="Total Agents" value={agents.length.toString()} />
          <StatCard icon={<MessageSquare className="h-6 w-6 text-green-400" />} label="Messages Today" value="2,456" />
          <StatCard icon={<Users className="h-6 w-6 text-blue-400" />} label="Active Users" value="892" />
          <StatCard icon={<TrendingUp className="h-6 w-6 text-yellow-400" />} label="Success Rate" value="94.2%" />
        </div>

        {/* Agents Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Your Agents</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <AgentCard 
                key={agent.id} 
                agent={agent} 
                onView={() => setSelectedAgent(agent.id)}
                onToggle={() => toggleAgent(agent.id)}
                onDelete={() => deleteAgent(agent.id)}
              />
            ))}
            
            {/* Create New Card */}
            <button 
              onClick={() => setShowCreateModal(true)}
              className="border-2 border-dashed border-slate-600 rounded-2xl p-6 hover:border-purple-500 hover:bg-purple-500/10 transition flex flex-col items-center justify-center min-h-[280px]"
            >
              <Plus className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-400 font-medium">Create New Agent</p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <ActivityRow time="2 min ago" event="Customer Support Bot handled 23 queries" type="success" />
            <ActivityRow time="15 min ago" event="Lead Generator sent 12 emails" type="info" />
            <ActivityRow time="1 hour ago" event="Content Writer published 3 blog posts" type="success" />
            <ActivityRow time="3 hours ago" event="New user signed up via WhatsApp bot" type="info" />
          </div>
        </div>
      </main>

      {/* Create Agent Modal */}
      {showCreateModal && (
        <CreateAgentModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* Agent Detail View */}
      {selectedAgent && (
        <AgentDetailView agentId={selectedAgent} onClose={() => setSelectedAgent(null)} />
      )}
    </div>
  );

  function toggleAgent(id: number) {
    setAgents(agents.map(a => a.id === id ? { ...a, status: a.status === "active" ? "paused" : "active" } : a));
  }

  function deleteAgent(id: number) {
    setAgents(agents.filter(a => a.id !== id));
  }
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-6 py-3 transition ${active ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-slate-700 hover:text-white'}`}
    >
      <span className="h-5 w-5">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        {icon}
        <TrendingUp className="h-5 w-5 text-green-400" />
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-gray-400">{label}</p>
    </div>
  );
}

function AgentCard({ agent, onView, onToggle, onDelete }: { 
  agent: any; 
  onView: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-purple-500 transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-xl bg-purple-600 flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
            <p className="text-gray-400 text-sm">{agent.channel}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${agent.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
          {agent.status}
        </span>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-gray-400">
          <MessageSquare className="h-4 w-4 mr-2" />
          {agent.messages.toLocaleString()} messages
        </div>
        <div className="flex items-center text-sm text-gray-400">
          <Clock className="h-4 w-4 mr-2" />
          Created {agent.created}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={onView} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition text-sm font-medium">
          View Details
        </button>
        <button onClick={onToggle} className="px-4 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition">
          {agent.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button onClick={onDelete} className="px-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded-lg transition">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ActivityRow({ time, event, type }: { time: string; event: string; type: "success" | "info" }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-700 last:border-0 hover:bg-slate-700/50 transition">
      <div className="flex items-center space-x-3">
        <div className={`h-2 w-2 rounded-full ${type === "success" ? "bg-green-400" : "bg-blue-400"}`} />
        <span className="text-white">{event}</span>
      </div>
      <span className="text-gray-400 text-sm">{time}</span>
    </div>
  );
}

function CreateAgentModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    name: "",
    type: "support",
    channel: "whatsapp",
    model: "groq/llama-3.1-70b",
    apiKey: "",
  });

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">Create New Agent</h2>
          <p className="text-gray-400">Step {step} of 3</p>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Agent Name</label>
                <input 
                  type="text" 
                  value={config.name}
                  onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="e.g., Customer Support Bot"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Agent Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <TypeCard selected={config.type === "support"} onClick={() => setConfig({ ...config, type: "support" })} title="Customer Support" icon={<MessageSquare />} />
                  <TypeCard selected={config.type === "lead"} onClick={() => setConfig({ ...config, type: "lead" })} title="Lead Generation" icon={<Users />} />
                  <TypeCard selected={config.type === "content"} onClick={() => setConfig({ ...config, type: "content" })} title="Content Writer" icon={<Zap />} />
                  <TypeCard selected={config.type === "research"} onClick={() => setConfig({ ...config, type: "research" })} title="Research Agent" icon={<BarChart3 />} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Communication Channel</label>
                <select 
                  value={config.channel}
                  onChange={(e) => setConfig({ ...config, channel: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="telegram">Telegram</option>
                  <option value="discord">Discord</option>
                  <option value="slack">Slack</option>
                  <option value="email">Email</option>
                </select>
              </div>
              <div>
                <label className="block text-white font-medium mb-2">AI Model</label>
                <select 
                  value={config.model}
                  onChange={(e) => setConfig({ ...config, model: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="groq/llama-3.1-70b">Llama 3.1 70B (Fast & Free)</option>
                  <option value="openrouter/claude-sonnet">Claude Sonnet (Best Quality)</option>
                  <option value="openrouter/gpt-4">GPT-4 (Advanced)</option>
                </select>
              </div>
              <div>
                <label className="block text-white font-medium mb-2">API Key</label>
                <input 
                  type="password" 
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="sk-..."
                />
                <p className="text-gray-400 text-sm mt-2">Get your API key from Groq or OpenRouter</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <Bot className="h-10 w-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Ready to Launch!</h3>
              <p className="text-gray-400 mb-6">
                Your <strong className="text-white">{config.name || "Agent"}</strong> will be deployed on <strong className="text-white">{config.channel}</strong>
              </p>
              <div className="bg-slate-700 rounded-xl p-4 text-left">
                <p className="text-white font-medium mb-2">Configuration Summary:</p>
                <p className="text-gray-400 text-sm">Name: {config.name || "Not set"}</p>
                <p className="text-gray-400 text-sm">Type: {config.type}</p>
                <p className="text-gray-400 text-sm">Channel: {config.channel}</p>
                <p className="text-gray-400 text-sm">Model: {config.model}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-700 flex justify-between">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="text-gray-400 hover:text-white transition">
              Back
            </button>
          ) : (
            <button onClick={onClose} className="text-gray-400 hover:text-white transition">
              Cancel
            </button>
          )}
          {step < 3 ? (
            <button 
              onClick={() => setStep(step + 1)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              Next
            </button>
          ) : (
            <button 
              onClick={onClose}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              Launch Agent
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TypeCard({ selected, onClick, title, icon }: { selected: boolean; onClick: () => void; title: string; icon: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition flex flex-col items-center ${selected ? 'border-purple-500 bg-purple-500/10' : 'border-slate-600 hover:border-slate-500'}`}
    >
      <span className="text-purple-400 mb-2">{icon}</span>
      <span className="text-white text-sm font-medium">{title}</span>
    </button>
  );
}

function AgentDetailView({ agentId, onClose }: { agentId: number; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Agent Details</h2>
            <p className="text-gray-400">Monitor and configure your agent</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">✕</button>
        </div>

        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-700 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Total Messages</p>
              <p className="text-2xl font-bold text-white">1,234</p>
            </div>
            <div className="bg-slate-700 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-white">96.2%</p>
            </div>
            <div className="bg-slate-700 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Avg Response</p>
              <p className="text-2xl font-bold text-white">1.2s</p>
            </div>
          </div>

          {/* Conversation Preview */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Recent Conversations</h3>
            <div className="bg-slate-700 rounded-xl p-4 space-y-4">
              <ConversationBubble from="user" text="What are your business hours?" />
              <ConversationBubble from="agent" text="We're open Monday-Friday, 9 AM to 6 PM IST. How can I help you today?" />
              <ConversationBubble from="user" text="I need help with my order" />
              <ConversationBubble from="agent" text="I'd be happy to help! Could you please provide your order number?" />
            </div>
          </div>

          {/* Configuration */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <ConfigItem label="Status" value="Active" />
              <ConfigItem label="Channel" value="WhatsApp" />
              <ConfigItem label="Model" value="Llama 3.1 70B" />
              <ConfigItem label="Created" value="2 days ago" />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-700 flex justify-end space-x-4">
          <button className="text-gray-400 hover:text-white transition">Edit Configuration</button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Full Analytics
          </button>
        </div>
      </div>
    </div>
  );
}

function ConversationBubble({ from, text }: { from: "user" | "agent"; text: string }) {
  return (
    <div className={`flex ${from === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${from === "user" ? "bg-purple-600 text-white" : "bg-slate-600 text-gray-200"}`}>
        <p className="text-sm font-medium mb-1">{from === "user" ? "User" : "Agent"}</p>
        <p>{text}</p>
      </div>
    </div>
  );
}

function ConfigItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-700 rounded-xl p-4">
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-white font-medium">{value}</p>
    </div>
  );
}
