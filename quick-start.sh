#!/bin/bash

echo "🚀 AgentFlow Quick Start"
echo "========================"
echo ""

# Check Zig
echo "✓ Checking Zig..."
export PATH="/tmp/zig-x86_64-linux-0.15.2:$PATH"
if ! zig version >/dev/null 2>&1; then
    echo "❌ Zig not found! Download from https://ziglang.org/download/"
    exit 1
fi
echo "  Zig version: $(zig version)"

# Check Nullclaw
echo "✓ Checking Nullclaw..."
NULLCLAW="/teamspace/studios/this_studio/nullclaw-repo/zig-out/bin/nullclaw"
if [ ! -f "$NULLCLAW" ]; then
    echo "❌ Nullclaw not built! Run: cd nullclaw-repo && zig build"
    exit 1
fi
echo "  Nullclaw: OK"

# Check config
echo "✓ Checking configuration..."
CONFIG="/teamspace/studios/this_studio/.nullclaw/config.json"
if [ ! -f "$CONFIG" ]; then
    echo "❌ Config not found!"
    exit 1
fi

if grep -q "YOUR_GROQ_API_KEY_HERE" "$CONFIG"; then
    echo "⚠️  API key not set! Edit $CONFIG"
    echo ""
    echo "📝 Get your API key:"
    echo "   1. Go to https://console.groq.com"
    echo "   2. Sign up and create a key"
    echo "   3. Edit: nano $CONFIG"
    echo "   4. Replace YOUR_GROQ_API_KEY_HERE with your key"
    echo ""
    exit 1
fi
echo "  Config: OK (API key configured)"

# Check frontend
echo "✓ Checking frontend..."
if [ ! -d "/teamspace/studios/this_studio/ai-agent-platform" ]; then
    echo "❌ Frontend not found!"
    exit 1
fi
echo "  Frontend: OK"

echo ""
echo "✅ All checks passed!"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. Start Nullclaw Gateway:"
echo "   export PATH=\"/tmp/zig-x86_64-linux-0.15.2:\$PATH\""
echo "   cd /teamspace/studios/this_studio/nullclaw-repo"
echo "   ./zig-out/bin/nullclaw gateway --port 3001"
echo ""
echo "2. Frontend is already running at http://localhost:3000"
echo ""
echo "3. Test with:"
echo "   curl http://localhost:3000/api/agents"
echo ""
echo "📖 Full guide: /teamspace/studios/this_studio/SETUP.md"
echo ""
