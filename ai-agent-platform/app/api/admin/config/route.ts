import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.env.HOME || "/root", ".nullclaw", "config.json");

// GET /api/admin/config - Fetch nullclaw config
export async function GET() {
  try {
    const configData = await fs.readFile(CONFIG_PATH, "utf-8");
    const config = JSON.parse(configData);
    
    return NextResponse.json(config);
  } catch (error) {
    console.error("Failed to read config:", error);
    return NextResponse.json(
      { error: "Failed to read configuration" },
      { status: 500 }
    );
  }
}

// POST /api/admin/config - Save nullclaw config
export async function POST(request: NextRequest) {
  try {
    const config = await request.json();
    
    // Validate config structure
    if (!config.models || !config.agents) {
      return NextResponse.json(
        { error: "Invalid configuration structure" },
        { status: 400 }
      );
    }

    // Write config file
    await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");

    return NextResponse.json({ success: true, message: "Configuration saved" });
  } catch (error) {
    console.error("Failed to write config:", error);
    return NextResponse.json(
      { error: "Failed to save configuration" },
      { status: 500 }
    );
  }
}
