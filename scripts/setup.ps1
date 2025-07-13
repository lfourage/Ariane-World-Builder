# Check Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Host "❌ Docker is not installed or not available in PATH."
  exit 1
}

# Check Docker Compose (plugin or legacy)
$hasCompose = docker compose version -ErrorAction SilentlyContinue
$hasOldCompose = Get-Command docker-compose -ErrorAction SilentlyContinue

if (-not $hasCompose -and -not $hasOldCompose) {
  Write-Host "❌ Docker Compose is not installed (neither plugin nor legacy)."
  exit 1
}

Write-Host "🔧 Creating .env file if needed..."
if (-Not (Test-Path ".env")) {
@"
DATABASE_URL="postgresql://postgres:postgres@db:5432/mydb"
NEXTAUTH_SECRET="my-super-secret"
"@ | Set-Content -Encoding UTF8 .env
  Write-Host "✅ .env file created."
} else {
  Write-Host "ℹ️ .env file already exists, skipping."
}

Write-Host "🐳 Building and starting containers..."
docker compose up -d --build

Write-Host "⏳ Waiting for the database to be ready..."
Start-Sleep -Seconds 5

Write-Host "🧬 Running Prisma setup..."
docker compose exec app npx prisma generate
docker compose exec app npx prisma migrate dev --name init

Write-Host "🚀 App running at http://localhost:3000"
