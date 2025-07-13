#!/bin/bash

set -e

echo "🛑 Stopping Docker containers..."
docker compose down -v --remove-orphans

echo "🧹 Cleaning build and database artifacts..."
rm -rf prisma/migrations
rm -rf .next
rm -rf node_modules
rm -f package-lock.json

read -p "❓ Do you want to delete the .env file? (y/N): " confirm
if [[ "$confirm" == "y" || "$confirm" == "Y" ]]; then
    rm -f .env
    echo "🗑️ .env file deleted."
fi

echo "✅ Teardown complete. You're back to a clean state."
