# Colors
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Cyan"

Write-Host "🛑 Stopping Docker containers..." -ForegroundColor $Blue
docker compose down -v --remove-orphans

Write-Host ""
Write-Host "🧹 Cleaning artifacts..." -ForegroundColor $Blue

# Always safe to clean
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
    Write-Host "  ✓ Removed .next" -ForegroundColor $Green
}

# Ask before cleaning migrations
$confirmMigrations = Read-Host "$(Write-Host 'Delete prisma/migrations? This will require re-running migrations. ' -NoNewline -ForegroundColor $Yellow)(y/N)"
if ($confirmMigrations -eq "y" -or $confirmMigrations -eq "Y") {
    if (Test-Path "prisma\migrations") {
        Remove-Item -Recurse -Force "prisma\migrations" -ErrorAction SilentlyContinue
        Write-Host "  ✓ Removed prisma/migrations" -ForegroundColor $Green
    }
}

# Ask before cleaning node_modules
$confirmNode = Read-Host "$(Write-Host 'Delete node_modules? This requires npm install. ' -NoNewline -ForegroundColor $Yellow)(y/N)"
if ($confirmNode -eq "y" -or $confirmNode -eq "Y") {
    if (Test-Path "node_modules") {
        Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
        Write-Host "  ✓ Removed node_modules" -ForegroundColor $Green
    }
}

# Ask before deleting .env
$confirmEnv = Read-Host "$(Write-Host 'Delete .env file? ' -NoNewline -ForegroundColor $Yellow)(y/N)"
if ($confirmEnv -eq "y" -or $confirmEnv -eq "Y") {
    if (Test-Path ".env") {
        Remove-Item -Force ".env" -ErrorAction SilentlyContinue
        Write-Host "  ✓ Removed .env" -ForegroundColor $Green
    }
}

Write-Host ""
Write-Host "✅ Teardown complete!" -ForegroundColor $Green
