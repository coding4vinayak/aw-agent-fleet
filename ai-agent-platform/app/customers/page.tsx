"use client";

import { useState, useEffect } from "react";
import { Users, Bot, CreditCard, Activity, Plus, Search, Eye, Edit, Trash2, TrendingUp, DollarSign, MessageSquare } from "lucide-react";

export default function CustomersDashboard() {
  const [customers, setCustomers] = useState([
    { id: 1, name: "Taj Mahal Restaurant", email: "contact@tajrestaurant.com", plan: "professional", status: "active", agents: 2, messages: 3456, revenue: 5000, created: "2026-02-15" },
    { id: 2, name: "Premium Properties", email: "info@premiumproperties.com", plan: "enterprise", status: "active", agents: 5, messages: 12890, revenue: 8000, created: "2026-02-20" },
    { id: 3, name: "Fashion Hub", email: "support@fashionhub.in", plan: "starter", status: "active", agents: 1, messages: 890, revenue: 2000, created: "2026-03-01" },
    { id: 4, name: "Tech Solutions", email: "hello@techsolutions.com", plan: "professional", status: "paused", agents: 3, messages: 5600, revenue: 5000, created: "2026-02-10" },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const totalRevenue = customers.reduce((sum, c) => sum + c.revenue, 0);
  const totalAgents = customers.reduce((sum, c) => sum + c.agents, 0);
  const totalMessages = customers.reduce((sum, c) => sum + c.messages, 0);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">AbetWorks Agent Fleet</h1>
              <p className="text-gray-400 text-sm">Manage your fleet of AI employees</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Customer</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-4 gap-6 mb-6">
          <StatCard icon={<Users className="h-6 w-6 text-purple-400" />} label="Total Customers" value={customers.length.toString()} trend="+3 this month" />
          <StatCard icon={<Bot className="h-6 w-6 text-blue-400" />} label="Active Agents" value={totalAgents.toString()} trend="Across all customers" />
          <StatCard icon={<MessageSquare className="h-6 w-6 text-green-400" />} label="Messages Today" value={totalMessages.toLocaleString()} trend="+12% vs yesterday" />
          <StatCard icon={<DollarSign className="h-6 w-6 text-yellow-400" />} label="Monthly Revenue" value={`₹${totalRevenue.toLocaleString()}`} trend="Recurring" />
        </div>

        {/* Customers Table */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">All Customers</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Agents</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Messages</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium">{customer.name}</p>
                      <p className="text-gray-400 text-sm">{customer.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <PlanBadge plan={customer.plan} />
                  </td>
                  <td className="px-6 py-4 text-white">{customer.agents}</td>
                  <td className="px-6 py-4 text-white">{customer.messages.toLocaleString()}</td>
                  <td className="px-6 py-4 text-white">₹{customer.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={customer.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => setSelectedCustomer(customer)} className="p-2 hover:bg-slate-600 rounded-lg">
                        <Eye className="h-4 w-4 text-blue-400" />
                      </button>
                      <button className="p-2 hover:bg-slate-600 rounded-lg">
                        <Edit className="h-4 w-4 text-green-400" />
                      </button>
                      <button className="p-2 hover:bg-slate-600 rounded-lg">
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <AddCustomerModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}

function StatCard({ icon, label, value, trend }) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        {icon}
        <TrendingUp className="h-5 w-5 text-green-400" />
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-green-400 text-xs mt-2">{trend}</p>
    </div>
  );
}

function PlanBadge({ plan }) {
  const colors = {
    starter: "bg-blue-500/20 text-blue-400",
    professional: "bg-purple-500/20 text-purple-400",
    enterprise: "bg-yellow-500/20 text-yellow-400",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[plan] || colors.starter}`}>
      {plan.charAt(0).toUpperCase() + plan.slice(1)}
    </span>
  );
}

function StatusBadge({ status }) {
  const configs = {
    active: { color: "bg-green-500/20 text-green-400", dot: "bg-green-400" },
    paused: { color: "bg-yellow-500/20 text-yellow-400", dot: "bg-yellow-400" },
    suspended: { color: "bg-red-500/20 text-red-400", dot: "bg-red-400" },
  };

  const config = configs[status] || configs.active;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center w-fit ${config.color}`}>
      <span className={`h-2 w-2 rounded-full ${config.dot} mr-2`}></span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function CustomerDetailModal({ customer, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">{customer.name}</h2>
            <p className="text-gray-400">{customer.email}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Overview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Plan</p>
              <p className="text-xl font-bold text-white capitalize">{customer.plan}</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Monthly Revenue</p>
              <p className="text-xl font-bold text-white">₹{customer.revenue.toLocaleString()}</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Status</p>
              <StatusBadge status={customer.status} />
            </div>
          </div>

          {/* Agents */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Active Agents</h3>
            <div className="grid gap-3">
              <AgentRow name="Customer Support Bot" channel="WhatsApp" status="active" messages={2345} />
              <AgentRow name="FAQ Assistant" channel="Telegram" status="active" messages={1111} />
            </div>
          </div>

          {/* Recent Conversations */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Recent Conversations</h3>
            <div className="space-y-2">
              <ConversationRow user="+91-9876543210" preview="I want to book a table for 4 people" time="5 min ago" />
              <ConversationRow user="@user123" preview="What are your business hours?" time="15 min ago" />
              <ConversationRow user="+91-9123456789" preview="Do you have vegetarian options?" time="1 hour ago" />
            </div>
          </div>

          {/* Usage */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Usage This Month</h3>
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white">Messages</span>
                <span className="text-white">{customer.messages.toLocaleString()} / 10,000</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${(customer.messages / 10000) * 100}%` }}></div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-700">
            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">Edit Customer</button>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">View Dashboard</button>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">Manage Agents</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentRow({ name, channel, status, messages }) {
  return (
    <div className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="h-10 w-10 rounded-lg bg-purple-600 flex items-center justify-center">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-white font-medium">{name}</p>
          <p className="text-gray-400 text-sm">{channel}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-white text-sm">{messages.toLocaleString()} messages</p>
          <StatusBadge status={status} />
        </div>
      </div>
    </div>
  );
}

function ConversationRow({ user, preview, time }) {
  return (
    <div className="bg-slate-700 rounded-lg p-3 flex items-center justify-between">
      <div className="flex-1">
        <p className="text-white font-medium">{user}</p>
        <p className="text-gray-400 text-sm truncate">{preview}</p>
      </div>
      <p className="text-gray-400 text-sm ml-4">{time}</p>
    </div>
  );
}

function AddCustomerModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    business_type: "restaurant",
    plan: "professional",
  });

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-lg w-full p-6">
        <h3 className="text-xl font-bold text-white mb-4">Add New Customer</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">Business Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
              placeholder="e.g., Taj Mahal Restaurant"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
              placeholder="contact@business.com"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
              placeholder="+91-9876543210"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Business Type</label>
            <select
              value={formData.business_type}
              onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
            >
              <option value="restaurant">Restaurant</option>
              <option value="real_estate">Real Estate</option>
              <option value="ecommerce">E-commerce</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Plan</label>
            <select
              value={formData.plan}
              onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
            >
              <option value="starter">Starter (₹2,000/mo)</option>
              <option value="professional">Professional (₹5,000/mo)</option>
              <option value="enterprise">Enterprise (₹8,000/mo)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            Create Customer
          </button>
        </div>
      </div>
    </div>
  );
}
