#!/bin/bash

# AgentFlow - Customer Fleet Deployment Script
# Deploys a complete AI agent setup for a new customer

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CUSTOMER_NAME=""
CUSTOMER_EMAIL=""
BUSINESS_TYPE=""
PLAN=""
WHATSAPP_NUMBER=""
TELEGRAM_BOT_TOKEN=""
API_KEY=""

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   AgentFlow - Customer Fleet Deployment               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Get customer details
echo -e "${YELLOW}Step 1: Customer Information${NC}"
echo "─────────────────────────────────────"
read -p "Business Name: " CUSTOMER_NAME
read -p "Contact Email: " CUSTOMER_EMAIL
read -p "Business Type (restaurant/real_estate/ecommerce/other): " BUSINESS_TYPE
read -p "Plan (starter/professional/enterprise): " PLAN

echo ""
echo -e "${YELLOW}Step 2: Communication Channels${NC}"
echo "─────────────────────────────────────"
read -p "WhatsApp Business Number (with +91): " WHATSAPP_NUMBER
read -p "Telegram Bot Token (leave empty if not needed): " TELEGRAM_BOT_TOKEN

echo ""
echo -e "${YELLOW}Step 3: AI Configuration${NC}"
echo "─────────────────────────────────────"
echo "Select AI Provider:"
echo "1) Groq (Free, Fast)"
echo "2) OpenRouter (50+ models)"
echo "3) Anthropic (Claude)"
echo "4) OpenAI (GPT)"
read -p "Choice [1-4]: " AI_CHOICE

case $AI_CHOICE in
  1)
    AI_PROVIDER="groq"
    AI_MODEL="llama-3.3-70b-versatile"
    read -p "Enter Groq API Key: " API_KEY
    ;;
  2)
    AI_PROVIDER="openrouter"
    AI_MODEL="anthropic/claude-sonnet"
    read -p "Enter OpenRouter API Key: " API_KEY
    ;;
  3)
    AI_PROVIDER="anthropic"
    AI_MODEL="claude-sonnet-4"
    read -p "Enter Anthropic API Key: " API_KEY
    ;;
  4)
    AI_PROVIDER="openai"
    AI_MODEL="gpt-4-turbo"
    read -p "Enter OpenAI API Key: " API_KEY
    ;;
  *)
    echo -e "${RED}Invalid choice!${NC}"
    exit 1
    ;;
esac

echo ""
echo -e "${YELLOW}Step 4: Business Configuration${NC}"
echo "─────────────────────────────────────"

# Generate customer ID
CUSTOMER_ID=$(echo "$CUSTOMER_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '_' | tr -cd '[:alnum:]_')
CUSTOMER_ID="${CUSTOMER_ID}_$(date +%Y%m%d)"

echo "Customer ID: $CUSTOMER_ID"

# Create customer directory
CUSTOMER_DIR="/opt/agentflow/customers/$CUSTOMER_ID"
sudo mkdir -p "$CUSTOMER_DIR"

# Generate customer config
echo -e "${GREEN}Generating customer configuration...${NC}"

cat > "$CUSTOMER_DIR/config.json" << EOF
{
  "customer_id": "$CUSTOMER_ID",
  "name": "$CUSTOMER_NAME",
  "email": "$CUSTOMER_EMAIL",
  "business_type": "$BUSINESS_TYPE",
  "plan": "$PLAN",
  "created_at": "$(date -Iseconds)",
  
  "models": {
    "providers": {
      "$AI_PROVIDER": {
        "api_key": "$API_KEY",
        "base_url": "$(get_base_url $AI_PROVIDER)"
      }
    }
  },
  
  "agents": {
    "defaults": {
      "model": {
        "primary": "$AI_PROVIDER/$AI_MODEL"
      }
    },
    "list": [
$(generate_agents $BUSINESS_TYPE $AI_PROVIDER $AI_MODEL)
    ]
  },
  
  "channels": {
    "cli": true,
    "whatsapp": {
      "accounts": {
        "main": {
          "phone_number": "$WHATSAPP_NUMBER",
          "allow_from": ["*"]
        }
      }
    },
    "telegram": {
      "accounts": {
        "main": {
          "bot_token": "$TELEGRAM_BOT_TOKEN",
          "allow_from": ["*"]
        }
      }
    }
  },
  
  "memory": {
    "backend": "sqlite",
    "auto_save": true,
    "hygiene_enabled": true,
    "archive_after_days": 7,
    "purge_after_days": 30
  },
  
  "gateway": {
    "port": $(get_next_port),
    "host": "127.0.0.1",
    "require_pairing": false
  },
  
  "autonomy": {
    "level": "supervised",
    "workspace_only": true,
    "max_actions_per_hour": 50
  }
}
EOF

echo -e "${GREEN}✓ Configuration created${NC}"

# Create systemd service
echo -e "${GREEN}Creating systemd service...${NC}"

sudo cat > "/etc/systemd/system/agentflow-$CUSTOMER_ID.service" << EOF
[Unit]
Description=AgentFlow Customer: $CUSTOMER_NAME
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$CUSTOMER_DIR
ExecStart=/usr/local/bin/nullclaw gateway --config $CUSTOMER_DIR/config.json
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
echo -e "${GREEN}Starting customer agent...${NC}"
sudo systemctl daemon-reload
sudo systemctl enable "agentflow-$CUSTOMER_ID"
sudo systemctl start "agentflow-$CUSTOMER_ID"

# Check status
sleep 3
STATUS=$(sudo systemctl is-active "agentflow-$CUSTOMER_ID")

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
if [ "$STATUS" = "active" ]; then
  echo -e "${GREEN}✓ Deployment Successful!${NC}"
else
  echo -e "${RED}✗ Deployment Failed${NC}"
fi
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Customer Details:"
echo "  Name: $CUSTOMER_NAME"
echo "  ID: $CUSTOMER_ID"
echo "  Plan: $PLAN"
echo "  Gateway Port: $(get_next_port)"
echo ""
echo "Next Steps:"
echo "  1. Customer can access dashboard at: http://localhost:8080/customers"
echo "  2. Login with email: $CUSTOMER_EMAIL"
echo "  3. Test WhatsApp/Telegram integration"
echo "  4. Monitor first conversations"
echo ""

# Helper functions
get_base_url() {
  case $1 in
    groq) echo "https://api.groq.com/openai/v1" ;;
    openrouter) echo "https://openrouter.ai/api/v1" ;;
    anthropic) echo "https://api.anthropic.com" ;;
    openai) echo "https://api.openai.com/v1" ;;
  esac
}

generate_agents() {
  local type=$1
  local provider=$2
  local model=$3
  
  case $type in
    restaurant)
      cat << EOF
      {
        "id": "reservation-bot",
        "model": { "primary": "$provider/$model" },
        "system_prompt": "You are a restaurant reservation assistant. Help customers book tables, answer menu questions, and provide business hours. Be friendly and helpful."
      },
      {
        "id": "faq-bot",
        "model": { "primary": "$provider/$model" },
        "system_prompt": "You answer FAQs about the restaurant: menu, prices, hours, location, parking, etc. Keep answers concise and accurate."
      }
EOF
      ;;
    real_estate)
      cat << EOF
      {
        "id": "lead-qualifier",
        "model": { "primary": "$provider/$model" },
        "system_prompt": "You are a real estate lead qualification assistant. Ask about budget, location preferences, property type, and timeline. Qualify leads for the sales team."
      },
      {
        "id": "viewing-scheduler",
        "model": { "primary": "$provider/$model" },
        "system_prompt": "You schedule property viewings. Collect preferred dates, times, and properties. Confirm appointments and send reminders."
      }
EOF
      ;;
    ecommerce)
      cat << EOF
      {
        "id": "support-bot",
        "model": { "primary": "$provider/$model" },
        "system_prompt": "You are an e-commerce customer support agent. Help with order tracking, returns, product questions, and complaints. Be empathetic and solution-oriented."
      },
      {
        "id": "sales-bot",
        "model": { "primary": "$provider/$model" },
        "system_prompt": "You help customers find products, recommend items, and assist with purchases. Be knowledgeable about the catalog and upsell when appropriate."
      }
EOF
      ;;
    *)
      cat << EOF
      {
        "id": "general-assistant",
        "model": { "primary": "$provider/$model" },
        "system_prompt": "You are a helpful AI assistant. Answer questions, provide information, and assist customers with their inquiries."
      }
EOF
      ;;
  esac
}

get_next_port() {
  # Simple port assignment based on customer count
  local count=$(ls /opt/agentflow/customers 2>/dev/null | wc -l)
  echo $((3001 + count * 10))
}
