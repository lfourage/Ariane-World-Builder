# Stop and remove containers, volumes, and networks
Write-Host "🛑 Stopping Docker containers..."
docker compose down -v --remove-orphans

# Clean up files
Write-Host "🧹 Cleaning build and database artifacts..."
Remove-Item -Recurse -Force .next, node_modules, prisma\migrations -ErrorAction SilentlyContinue
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue

# Ask for .env deletion
$confirm = Read-Host "❓ Do you want to delete the .env file? (y/N)"
if ($confirm -eq "y" -or $confirm -eq "Y") {
    Remove-Item .env -Force -ErrorAction SilentlyContinue
    Write-Host "🗑️ .env file deleted."
}

Write-Host "✅ Teardown complete. You're back to a clean state."
