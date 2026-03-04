import { NextRequest, NextResponse } from "next/server";

// Connects to your nullclaw gateway
const NULLCLAW_URL = process.env.NULLCLAW_URL || 'http://127.0.0.1:3001/webhook';
const NULLCLAW_TOKEN = process.env.NULLCLAW_TOKEN || 'nullclaw-web-token-12345';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, agentId } = body;

    console.log("Received message:", message, "for agent:", agentId);

    // Try to call nullclaw gateway
    try {
      const response = await fetch(NULLCLAW_URL, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${NULLCLAW_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message,
          agent_id: agentId || "default"
        }),
        timeout: 30000
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          success: true,
          data: {
            response: data.response || data.message || "Message processed",
            agentId: agentId || "default",
            timestamp: new Date().toISOString(),
          },
        });
      }
    } catch (fetchError) {
      console.log("Nullclaw not available, using fallback:", fetchError);
    }

    // Fallback: Simulated response when nullclaw is not running
    const response = {
      success: true,
      data: {
        response: `Nullclaw gateway not running. Start with: cd nullclaw-repo && ./zig-out/bin/nullclaw gateway --port 3001\n\nYour message: "${message}"`,
        agentId: agentId || "default",
        timestamp: new Date().toISOString(),
        note: "Start nullclaw gateway to get real AI responses"
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process message" },
      { status: 500 }
    );
  }
}
