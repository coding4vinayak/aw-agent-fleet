import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const CUSTOMERS_DIR = path.join(process.env.HOME || "/root", ".abetworks", "customers");

// GET /api/agents - List all agents for a customer
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customer_id");

    if (!customerId) {
      return NextResponse.json(
        { error: "customer_id required" },
        { status: 400 }
      );
    }

    const customerDir = path.join(CUSTOMERS_DIR, customerId, "agents");
    
    try {
      const files = await fs.readdir(customerDir);
      const agents = [];

      for (const file of files) {
        if (file.endsWith(".json")) {
          const content = await fs.readFile(path.join(customerDir, file), "utf-8");
          const agent = JSON.parse(content);
          agents.push(agent);
        }
      }

      return NextResponse.json({ agents });
    } catch (error) {
      // Directory doesn't exist yet
      return NextResponse.json({ agents: [] });
    }
  } catch (error) {
    console.error("Failed to list agents:", error);
    return NextResponse.json(
      { error: "Failed to list agents" },
      { status: 500 }
    );
  }
}

// POST /api/agents - Create a new agent for a customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_id, agent_id, type, channel, model, system_prompt, api_key } = body;

    if (!customer_id || !agent_id) {
      return NextResponse.json(
        { error: "customer_id and agent_id required" },
        { status: 400 }
      );
    }

    const customerDir = path.join(CUSTOMERS_DIR, customer_id);
    const agentsDir = path.join(customerDir, "agents");
    
    // Create directories if they don't exist
    await fs.mkdir(agentsDir, { recursive: true });

    // Create agent config
    const agentConfig = {
      agent_id,
      customer_id,
      type: type || "general",
      channel: channel || "cli",
      model: {
        provider: model?.provider || "groq",
        api_key: api_key,
        model: model?.model || "llama-3.3-70b-versatile"
      },
      system_prompt: system_prompt || "You are a helpful AI assistant.",
      status: "active",
      created_at: new Date().toISOString()
    };

    const agentFile = path.join(agentsDir, `${agent_id}.json`);
    await fs.writeFile(agentFile, JSON.stringify(agentConfig, null, 2), "utf-8");

    return NextResponse.json({ 
      success: true, 
      message: "Agent created successfully",
      agent: agentConfig 
    });
  } catch (error) {
    console.error("Failed to create agent:", error);
    return NextResponse.json(
      { error: "Failed to create agent" },
      { status: 500 }
    );
  }
}

// DELETE /api/agents - Delete an agent
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customer_id = searchParams.get("customer_id");
    const agent_id = searchParams.get("agent_id");

    if (!customer_id || !agent_id) {
      return NextResponse.json(
        { error: "customer_id and agent_id required" },
        { status: 400 }
      );
    }

    const agentFile = path.join(CUSTOMERS_DIR, customer_id, "agents", `${agent_id}.json`);
    await fs.unlink(agentFile);

    return NextResponse.json({ success: true, message: "Agent deleted" });
  } catch (error) {
    console.error("Failed to delete agent:", error);
    return NextResponse.json(
      { error: "Failed to delete agent" },
      { status: 500 }
    );
  }
}
