# Colors for PowerShell
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Cyan"

Write-Host "🔍 Checking prerequisites..." -ForegroundColor $Blue

# Check Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker is not installed or not available in PATH." -ForegroundColor $Red
    exit 1
}

# Check Docker Compose
$hasCompose = docker compose version 2>$null
$hasOldCompose = Get-Command docker-compose -ErrorAction SilentlyContinue

if (-not $hasCompose -and -not $hasOldCompose) {
    Write-Host "❌ Docker Compose is not installed." -ForegroundColor $Red
    exit 1
}

Write-Host "✅ Prerequisites OK" -ForegroundColor $Green
Write-Host ""

# Create .env from .env.example
Write-Host "🔧 Checking .env file..." -ForegroundColor $Blue

if (-Not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ .env file created from .env.example" -ForegroundColor $Green
        Write-Host "⚠️  Don't forget to update NEXTAUTH_SECRET in .env" -ForegroundColor $Yellow
    } else {
        Write-Host "❌ .env.example not found. Cannot create .env" -ForegroundColor $Red
        exit 1
    }
} else {
    Write-Host "ℹ️  .env file already exists" -ForegroundColor $Green
}

# Build and start containers
Write-Host ""
Write-Host "🐳 Building and starting containers..." -ForegroundColor $Blue
docker compose up -d --build

# Wait for database
Write-Host ""
Write-Host "⏳ Waiting for database..." -ForegroundColor $Blue

$maxAttempts = 30
$attempt = 1
$dbReady = $false

while ($attempt -le $maxAttempts) {
    $result = docker compose exec -T db pg_isready -U postgres 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database is ready!" -ForegroundColor $Green
        $dbReady = $true
        break
    }
    Write-Host "Waiting... (attempt $attempt/$maxAttempts)"
    Start-Sleep -Seconds 2
    $attempt++
}

if (-not $dbReady) {
    Write-Host "❌ Database failed to start" -ForegroundColor $Red
    docker compose logs db
    exit 1
}

# Run Prisma setup
Write-Host ""
Write-Host "🧬 Running Prisma setup..." -ForegroundColor $Blue
docker compose exec -T app npx prisma generate
docker compose exec -T app npx prisma migrate deploy

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor $Green
Write-Host "🚀 App running at http://localhost:3000" -ForegroundColor $Blue
Write-Host "📊 Prisma Studio: make studio" -ForegroundColor $Blue
Write-Host "📋 Logs: make logs" -ForegroundColor $Blue
