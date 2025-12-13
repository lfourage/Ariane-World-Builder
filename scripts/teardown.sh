#!/bin/bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🛑 Stopping Docker containers...${NC}"
docker compose down -v --remove-orphans

echo -e "\n${BLUE}🧹 Cleaning artifacts...${NC}"

# Always safe to clean
rm -rf .next
echo -e "${GREEN}  ✓ Removed .next${NC}"

# Ask before cleaning migrations (data loss)
echo -e "${YELLOW}Delete prisma/migrations? This will require re-running migrations.${NC}"
read -p "(y/N): " confirm_migrations
if [[ "$confirm_migrations" == "y" || "$confirm_migrations" == "Y" ]]; then
    rm -rf prisma/migrations
    echo -e "${GREEN}  ✓ Removed prisma/migrations${NC}"
fi

# Ask before cleaning node_modules (slow to reinstall)
echo -e "${YELLOW}Delete node_modules? This requires npm install.${NC}"
read -p "(y/N): " confirm_node
if [[ "$confirm_node" == "y" || "$confirm_node" == "Y" ]]; then
    rm -rf node_modules
    echo -e "${GREEN}  ✓ Removed node_modules${NC}"
fi

# Ask before deleting .env
echo -e "${YELLOW}Delete .env file?${NC}"
read -p "(y/N): " confirm_env
if [[ "$confirm_env" == "y" || "$confirm_env" == "Y" ]]; then
    rm -f .env
    echo -e "${GREEN}  ✓ Removed .env${NC}"
fi

echo -e "\n${GREEN}✅ Teardown complete!${NC}"
