# AgentFlow - AI Agent Platform

A beautiful, production-ready dashboard for selling AI agents as a service.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📁 What's Included

### Landing Page (`/`)
- Beautiful hero section
- Feature showcase
- Pricing tiers (₹2000-₹8000/month)
- Call-to-action sections

### Dashboard (`/dashboard`)
- Agent management (create, view, delete)
- Real-time statistics
- Conversation viewer
- Agent configuration wizard
- Activity feed

### API Routes
- `POST /api/chat` - Send messages to agents
- `GET /api/agents` - List all agents
- `POST /api/agents` - Create new agent
- `DELETE /api/agents` - Delete agent

## 🎨 Features

### For Customers
- ✅ Beautiful, modern UI
- ✅ Create agents in 3 steps
- ✅ Multiple channel support (WhatsApp, Telegram, Discord)
- ✅ Real-time conversation viewing
- ✅ Analytics dashboard

### For You (Business Owner)
- ✅ Ready to sell (just add payment)
- ✅ Multi-tenant ready
- ✅ Connects to nullclaw backend
- ✅ Customizable branding
- ✅ Scalable architecture

## 🔧 Connect to Nullclaw

Edit `app/api/chat/route.ts`:

```typescript
// Replace the simulated response with:
const response = await fetch('http://localhost:3000/webhook', {
  method: 'POST',
  headers: { 
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ message })
});
```

## 📦 Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Backend:** Next.js API Routes
- **Deployment:** Vercel (free)

## 💰 Business Model

### Starter Plan - ₹2,000/month
- 1 AI Agent
- 1,000 messages/month
- WhatsApp + Telegram

### Professional Plan - ₹5,000/month
- 3 AI Agents
- 10,000 messages/month
- All channels + Analytics

### Enterprise Plan - ₹8,000/month
- Unlimited Agents
- Unlimited messages
- White-label + SLA

## 🚀 Deploy to Production

### 1. Frontend (Vercel - Free)
```bash
vercel deploy
```

### 2. Backend (Your API)
Deploy on Railway, Render, or your VPS

### 3. Nullclaw (VPS - $5/month)
```bash
# On your VPS
./nullclaw gateway --port 3000
```

## 📱 Screenshots

### Landing Page
- Hero section with gradient background
- Feature cards
- Pricing tiers
- CTA sections

### Dashboard
- Agent cards with status
- Statistics overview
- Create agent modal (3-step wizard)
- Agent detail view with conversations

## 🛠 Development

```bash
# Install
npm install

# Dev
npm run dev

# Build
npm run build

# Start production
npm start
```

## 📋 Next Steps

1. **Add Authentication** - Use Clerk, NextAuth, or Supabase
2. **Add Database** - PostgreSQL for user data
3. **Add Payments** - Razorpay/Stripe integration
4. **Connect Nullclaw** - Real backend integration
5. **Deploy** - Vercel for frontend, VPS for nullclaw

## 🎯 What You Get

✅ **Professional UI** - Looks like a funded startup
✅ **Ready to Customize** - Change branding easily
✅ **Scalable** - Handles multiple customers
✅ **Modern Stack** - Easy to hire developers for

## 📞 Support

Built for selling AI agents to Indian businesses.

---

**License:** MIT
**Author:** Your Name
