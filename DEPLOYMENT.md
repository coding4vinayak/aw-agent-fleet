# Deployment Guide

## Quick Deploy Options

### Option 1: Vercel + VPS (Recommended)

**Frontend on Vercel (Free)**
**Backend on VPS ($5/month)**

---

## Vercel Deployment (Frontend)

### Step 1: Push to GitHub

```bash
cd /teamspace/studios/this_studio/ai-agent-platform

# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/agentflow.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repo
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `ai-agent-platform`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

5. Add Environment Variables:
   ```
   NULLCLAW_URL=https://your-vps-ip:3001/webhook
   NULLCLAW_TOKEN=nullclaw-web-token-12345
   ```

6. Click "Deploy"

### Step 3: Custom Domain (Optional)

1. Buy domain (Namecheap, GoDaddy)
2. In Vercel dashboard → Settings → Domains
3. Add your domain
4. Update DNS records as shown

---

## VPS Deployment (Backend)

### Providers

| Provider | Price | Specs | Best For |
|----------|-------|-------|----------|
| Hetzner | €5/mo | 2 vCPU, 2GB RAM | Best value |
| DigitalOcean | $6/mo | 1 vCPU, 1GB RAM | Easy to use |
| Linode | $5/mo | 1 vCPU, 1GB RAM | Good support |
| Vultr | $5/mo | 1 vCPU, 1GB RAM | Global locations |

### Step 1: Create VPS

1. Sign up for provider
2. Create new instance:
   - **OS:** Ubuntu 22.04 LTS
   - **Size:** 1 vCPU, 1GB RAM minimum
   - **Location:** Closest to your customers

3. Get SSH key and IP address

### Step 2: SSH into VPS

```bash
ssh root@your-vps-ip
```

### Step 3: Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install Zig
cd /tmp
curl -LO https://ziglang.org/download/0.15.2/zig-x86_64-linux-0.15.2.tar.xz
tar -xf zig-x86_64-linux-0.15.2.tar.xz
mv zig-0.15.2 /opt/zig
echo 'export PATH="/opt/zig:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Verify
zig version  # Should show 0.15.2
```

### Step 4: Build Nullclaw

```bash
# Clone nullclaw
git clone https://github.com/nullclaw/nullclaw.git
cd nullclaw

# Build
zig build

# Install globally
cp zig-out/bin/nullclaw /usr/local/bin/
```

### Step 5: Configure

```bash
# Create config directory
mkdir -p /etc/nullclaw

# Create config
nano /etc/nullclaw/config.json
```

Add your configuration:
```json
{
  "models": {
    "providers": {
      "groq": {
        "api_key": "gsk_your_key",
        "base_url": "https://api.groq.com/openai/v1"
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "groq/llama-3.3-70b-versatile"
      }
    }
  },
  "gateway": {
    "port": 3001,
    "host": "0.0.0.0"
  },
  "memory": {
    "backend": "sqlite",
    "auto_save": true
  }
}
```

### Step 6: Create Systemd Service

```bash
nano /etc/systemd/system/nullclaw.service
```

Add:
```ini
[Unit]
Description=Nullclaw AI Gateway
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/nullclaw
Environment="HOME=/root"
ExecStart=/usr/local/bin/nullclaw gateway --port 3001 --host 0.0.0.0
Restart=always
RestartSec=5

# Security
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
systemctl daemon-reload
systemctl enable nullclaw
systemctl start nullclaw
systemctl status nullclaw
```

### Step 7: Configure Firewall

```bash
# Install UFW
apt install -y ufw

# Allow SSH
ufw allow 22

# Allow gateway
ufw allow 3001

# Enable firewall
ufw enable
ufw status
```

### Step 8: Test

```bash
# From VPS
curl http://localhost:3001/health

# From your computer
curl http://your-vps-ip:3001/health
```

---

## Docker Deployment

### Prerequisites

- Docker installed
- Docker Compose installed

### Step 1: Create Dockerfile (Frontend)

```dockerfile
# ai-agent-platform/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 8080

ENV NODE_ENV=production

CMD ["node", "server.js"]
```

### Step 2: Create Dockerfile (Nullclaw)

```dockerfile
# nullclaw-repo/Dockerfile
FROM zig:0.15.2 AS builder

WORKDIR /app

COPY . .
RUN zig build -Doptimize=ReleaseSmall

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/zig-out/bin/nullclaw ./
COPY --from=builder /app/lib ./lib

RUN mkdir -p /root/.nullclaw

EXPOSE 3001

CMD ["./nullclaw", "gateway", "--port", "3001", "--host", "0.0.0.0"]
```

### Step 3: Create docker-compose.yml

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./ai-agent-platform
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - NULLCLAW_URL=http://nullclaw:3001/webhook
      - NULLCLAW_TOKEN=nullclaw-web-token-12345
    depends_on:
      - nullclaw
    restart: unless-stopped

  nullclaw:
    build:
      context: ./nullclaw-repo
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    volumes:
      - ./config:/root/.nullclaw
      - nullclaw_data:/root/.nullclaw/memory.db
    environment:
      - HOME=/root
    restart: unless-stopped

  # Optional: PostgreSQL for multi-tenant
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: agentflow
      POSTGRES_PASSWORD: your-secure-password
      POSTGRES_DB: agentflow
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

volumes:
  nullclaw_data:
  postgres_data:
```

### Step 4: Build and Run

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Step 5: Deploy to Cloud

#### DigitalOcean App Platform

1. Push to GitHub
2. Go to DigitalOcean → Create → App
3. Connect GitHub repo
4. Select Dockerfile
5. Deploy!

#### AWS ECS

```bash
# Build and push to ECR
aws ecr create-repository --repository-name agentflow
docker tag agentflow:latest <account>.dkr.ecr.region.amazonaws.com/agentflow:latest
docker push <account>.dkr.ecr.region.amazonaws.com/agentflow:latest

# Deploy to ECS
# Use AWS console or ECS CLI
```

#### Google Cloud Run

```bash
# Build and push to GCR
gcloud builds submit --tag gcr.io/PROJECT_ID/agentflow

# Deploy
gcloud run deploy agentflow \
  --image gcr.io/PROJECT_ID/agentflow \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## Railway Deployment

### Frontend

1. Push to GitHub
2. Go to https://railway.app
3. New Project → Deploy from GitHub
4. Select `ai-agent-platform`
5. Add Variables:
   ```
   NULLCLAW_URL=https://your-railway-url.up.railway.app/webhook
   NULLCLAW_TOKEN=nullclaw-web-token-12345
   ```
6. Deploy

**Note:** Railway doesn't support Zig binaries well. Use for frontend only, deploy nullclaw on VPS.

---

## Render Deployment

### Web Service

1. Push to GitHub
2. Go to https://render.com
3. New → Web Service
4. Connect repo
5. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment:**
     ```
     NULLCLAW_URL=https://your-vps:3001/webhook
     NULLCLAW_TOKEN=nullclaw-web-token-12345
     ```

---

## Production Checklist

### Security

- [ ] Enable HTTPS (Let's Encrypt)
- [ ] Set up firewall (UFW)
- [ ] Change default tokens
- [ ] Enable audit logging
- [ ] Set resource limits
- [ ] Enable automatic updates

### Performance

- [ ] Enable caching (Redis)
- [ ] Set up CDN (Cloudflare)
- [ ] Configure database connection pooling
- [ ] Enable gzip compression
- [ ] Set up monitoring (Prometheus)

### Reliability

- [ ] Set up backups
- [ ] Configure health checks
- [ ] Enable auto-restart
- [ ] Set up alerts (PagerDuty)
- [ ] Create disaster recovery plan

### Monitoring

```bash
# Install Prometheus node exporter
apt install -y prometheus-node-exporter

# Install Grafana
apt install -y grafana

# Access at http://your-vps:3000
```

---

## Cost Breakdown

### Minimal Setup (~$5/month)

- VPS (Hetzner): €5
- Frontend (Vercel): Free
- Database (SQLite): Free
- **Total:** ~$5/month

### Professional Setup (~$25/month)

- VPS (DigitalOcean): $12
- Frontend (Vercel Pro): $20
- Database (PostgreSQL): $15
- **Total:** ~$47/month

### Enterprise Setup (~$100/month)

- Multiple VPS: $50
- Load Balancer: $20
- Managed Database: $40
- CDN: $20
- **Total:** ~$130/month

---

## Scaling Strategy

### 0-10 Customers

- Single VPS
- SQLite database
- Manual deployment

### 10-100 Customers

- Multiple VPS instances
- PostgreSQL database
- Automated deployment (GitHub Actions)
- Load balancer

### 100-1000 Customers

- Kubernetes cluster
- Read replicas
- Redis caching
- Auto-scaling
- Multi-region

---

## Support

For deployment issues:
1. Check logs: `journalctl -u nullclaw -f`
2. Test connectivity: `curl http://localhost:3001/health`
3. Review config: `cat /etc/nullclaw/config.json`
