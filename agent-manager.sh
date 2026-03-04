#!/bin/bash

# AbetWorks Agent Fleet - Multi-Agent Deployment Manager
# Creates and manages multiple agents per customer

set -e

CUSTOMER_ID=$1
ACTION=$2

if [ -z "$CUSTOMER_ID" ]; then
    echo "Usage: ./agent-manager.sh <customer_id> <action>"
    echo "Actions: create, start, stop, restart, status, list-agents"
    exit 1
fi

CUSTOMERS_DIR="/opt/abetworks/customers"
CUSTOMER_DIR="$CUSTOMERS_DIR/$CUSTOMER_ID"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo -e "${BLUE}  AbetWorks Agent Fleet - Agent Manager     ${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo ""

case $ACTION in
    create)
        echo -e "${YELLOW}Creating agent configuration for $CUSTOMER_ID...${NC}"
        
        # Create customer directory
        sudo mkdir -p "$CUSTOMER_DIR"
        
        # Read agent details
        echo "Agent Name: "
        read AGENT_NAME
        echo "Agent Type (support/sales/research/faq): "
        read AGENT_TYPE
        echo "Channel (whatsapp/telegram/discord): "
        read CHANNEL
        echo "AI Provider (groq/openrouter/anthropic): "
        read AI_PROVIDER
        echo "API Key: "
        read -s API_KEY
        echo ""
        echo "System Prompt: "
        read SYSTEM_PROMPT
        
        # Generate agent config
        AGENT_CONFIG_FILE="$CUSTOMER_DIR/agents/${AGENT_NAME// /_}.json"
        sudo mkdir -p "$CUSTOMER_DIR/agents"
        
        sudo cat > "$AGENT_CONFIG_FILE" << EOF
{
  "agent_id": "${AGENT_NAME// /_}",
  "customer_id": "$CUSTOMER_ID",
  "type": "$AGENT_TYPE",
  "channel": "$CHANNEL",
  "model": {
    "provider": "$AI_PROVIDER",
    "api_key": "$API_KEY",
    "model": "llama-3.3-70b-versatile"
  },
  "system_prompt": "$SYSTEM_PROMPT",
  "status": "active",
  "created_at": "$(date -Iseconds)"
}
EOF
        
        echo -e "${GREEN}✓ Agent created: $AGENT_CONFIG_FILE${NC}"
        ;;
    
    start)
        echo -e "${YELLOW}Starting agents for $CUSTOMER_ID...${NC}"
        
        # Find all agent configs for this customer
        AGENT_COUNT=0
        for agent_config in "$CUSTOMER_DIR/agents"/*.json; do
            if [ -f "$agent_config" ]; then
                AGENT_NAME=$(basename "$agent_config" .json)
                PORT=$((3001 + AGENT_COUNT * 10))
                
                echo "Starting agent: $AGENT_NAME on port $PORT"
                
                # Start nullclaw with this agent's config
                nohup nullclaw gateway --config "$agent_config" --port $PORT > "$CUSTOMER_DIR/logs/${AGENT_NAME}.log" 2>&1 &
                
                AGENT_COUNT=$((AGENT_COUNT + 1))
            fi
        done
        
        echo -e "${GREEN}✓ Started $AGENT_COUNT agents${NC}"
        ;;
    
    stop)
        echo -e "${YELLOW}Stopping agents for $CUSTOMER_ID...${NC}"
        
        # Kill all processes for this customer
        pkill -f "nullclaw.*$CUSTOMER_ID" || true
        
        echo -e "${GREEN}✓ Stopped all agents${NC}"
        ;;
    
    restart)
        $0 $CUSTOMER_ID stop
        sleep 2
        $0 $CUSTOMER_ID start
        ;;
    
    status)
        echo -e "${YELLOW}Agent Status for $CUSTOMER_ID:${NC}"
        echo ""
        
        if [ -d "$CUSTOMER_DIR/agents" ]; then
            for agent_config in "$CUSTOMER_DIR/agents"/*.json; do
                if [ -f "$agent_config" ]; then
                    AGENT_NAME=$(basename "$agent_config" .json)
                    
                    # Check if process is running
                    if pgrep -f "nullclaw.*$AGENT_NAME" > /dev/null; then
                        STATUS="${GREEN}Running${NC}"
                    else
                        STATUS="${RED}Stopped${NC}"
                    fi
                    
                    echo "  Agent: $AGENT_NAME - $STATUS"
                fi
            done
        else
            echo "  No agents found"
        fi
        ;;
    
    list-agents)
        echo -e "${YELLOW}All Agents for $CUSTOMER_ID:${NC}"
        echo ""
        
        if [ -d "$CUSTOMER_DIR/agents" ]; then
            for agent_config in "$CUSTOMER_DIR/agents"/*.json; do
                if [ -f "$agent_config" ]; then
                    AGENT_NAME=$(basename "$agent_config" .json)
                    echo "  - $AGENT_NAME"
                fi
            done
        else
            echo "  No agents configured"
        fi
        ;;
    
    *)
        echo -e "${RED}Unknown action: $ACTION${NC}"
        echo "Actions: create, start, stop, restart, status, list-agents"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}════════════════════════════════════════════${NC}"
