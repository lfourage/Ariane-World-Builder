#!/bin/bash

set -e

if ! command -v docker &>/dev/null; then
    echo "❌ Docker is not installed or not in your PATH."
    exit 1
fi

if ! docker compose version &>/dev/null && ! command -v docker-compose &>/dev/null; then
    echo "❌ Docker Compose is not installed (neither plugin nor legacy binary)."
    exit 1
fi

echo "🔧 Creating .env file if needed..."
if [ ! -f ".env" ]; then
    cat <<EOF >.env
DATABASE_URL="postgresql://postgres:postgres@db:5432/mydb"
NEXTAUTH_SECRET="my-super-secret"
EOF
    echo "✅ .env file created."
else
    echo "ℹ️ .env file already exists, skipping."
fi

echo "🐳 Building and starting containers..."
docker compose up -d --build

echo "⏳ Waiting for the database to be ready..."
sleep 5

echo "🧬 Running Prisma setup..."
docker compose exec app npx prisma generate
docker compose exec app npx prisma migrate dev --name init

echo "🚀 App running at http://localhost:3000"
