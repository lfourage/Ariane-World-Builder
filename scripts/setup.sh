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
DATABASE_URL="postgresql://postgres:password@db:5432/mydb?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="my-super-secret"
EOF
    echo "✅ .env file created."
else
    echo "ℹ️ .env file already exists, skipping."
fi

echo "🐳 Building and starting containers..."
docker compose up -d --build

echo "⏳ Waiting for the database to be ready..."

max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker compose exec db pg_isready -U postgres >/dev/null 2>&1; then
        echo "✅ Database is ready!"
        break
    fi
    echo "Waiting for database... (attempt $attempt/$max_attempts)"
    sleep 2
    ((attempt++))
done

if [ $attempt -gt $max_attempts ]; then
    echo "❌ Database failed to start after $max_attempts attempts"
    docker compose logs db
    exit 1
fi

sleep 3

echo "🧬 Running Prisma setup..."
docker compose exec app npx prisma generate
docker compose exec app npx prisma migrate dev --name init

echo "⏳ Waiting for the app to be ready..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -s http://localhost:3000 >/dev/null 2>&1; then
        echo "✅ App is ready!"
        break
    fi
    echo "Waiting for app... (attempt $attempt/$max_attempts)"
    sleep 2
    ((attempt++))
done

if [ $attempt -gt $max_attempts ]; then
    echo "❌ App failed to start after $max_attempts attempts"
    docker compose logs app
    exit 1
fi
