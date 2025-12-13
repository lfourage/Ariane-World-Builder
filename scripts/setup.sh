#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

if ! command -v docker &>/dev/null; then
    echo -e "${RED}❌ Docker is not installed or not in your PATH.${NC}"
    exit 1
fi

if ! docker compose version &>/dev/null && ! command -v docker-compose &>/dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites OK${NC}\n"

# Create .env from .env.example if needed
echo -e "${BLUE}🔧 Checking .env file...${NC}"
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ .env file created from .env.example${NC}"
        echo -e "${YELLOW}⚠️  Don't forget to update NEXTAUTH_SECRET in .env${NC}"
    else
        echo -e "${RED}❌ .env.example not found. Cannot create .env${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}ℹ️  .env file already exists${NC}"
fi

# Build and start containers
echo -e "\n${BLUE}🐳 Building and starting containers...${NC}"
docker compose up -d --build

# Wait for database
echo -e "\n${BLUE}⏳ Waiting for database...${NC}"
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker compose exec -T db pg_isready -U postgres >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Database is ready!${NC}"
        break
    fi
    echo "Waiting... (attempt $attempt/$max_attempts)"
    sleep 2
    ((attempt++))
done

if [ $attempt -gt $max_attempts ]; then
    echo -e "${RED}❌ Database failed to start${NC}"
    docker compose logs db
    exit 1
fi

# Run Prisma setup
echo -e "\n${BLUE}🧬 Running Prisma setup...${NC}"
docker compose exec -T app npx prisma generate
docker compose exec -T app npx prisma migrate deploy

echo -e "\n${GREEN}✅ Setup complete!${NC}"
echo -e "${BLUE}🚀 App running at http://localhost:3000${NC}"
echo -e "${BLUE}📊 Prisma Studio: make studio${NC}"
echo -e "${BLUE}📋 Logs: make logs${NC}"
