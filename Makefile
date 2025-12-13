OS := $(shell uname -s)

ifeq ($(OS),Linux)
  SETUP_CMD := ./scripts/setup.sh
  TEARDOWN_CMD := ./scripts/teardown.sh
else ifeq ($(OS),Darwin)
  SETUP_CMD := ./scripts/setup.sh
  TEARDOWN_CMD := ./scripts/teardown.sh
else
  SETUP_CMD := powershell -ExecutionPolicy Bypass -File .\scripts\setup.ps1
  TEARDOWN_CMD := powershell -ExecutionPolicy Bypass -File .\scripts\teardown.ps1
endif

.PHONY: setup clear clean reset start stop restart studio logs shell db-shell migrate migrate-create format lint help

# Main commands
setup:
	$(SETUP_CMD)

clear:
	$(TEARDOWN_CMD)

clean:
	@echo "🧹 Cleaning development artifacts..."
	@docker compose stop
	@rm -rf .next node_modules
	@echo "✅ Cleaned .next and node_modules"
	@echo "ℹ️  Run 'make start' to restart containers"
	@echo "ℹ️  Run 'npm install' to restore node_modules"

reset:
	$(TEARDOWN_CMD)
	$(SETUP_CMD)

# Container management
start:
	@echo "🚀 Starting containers..."
	@docker compose start

stop:
	@echo "🛑 Stopping containers..."
	@docker compose stop

restart:
	@echo "🔄 Restarting containers..."
	@docker compose restart

# Development tools
studio:
	@echo "📊 Opening Prisma Studio..."
	@docker compose exec app npx prisma studio

logs:
	@echo "📋 Following logs (Ctrl+C to exit)..."
	@docker compose logs -f app

shell:
	@echo "🐚 Opening shell in app container..."
	@docker compose exec app sh

db-shell:
	@echo "🐘 Opening PostgreSQL shell..."
	@docker compose exec db psql -U postgres -d mydb

# Database
migrate:
	@echo "🧬 Applying migrations..."
	@docker compose exec app npx prisma migrate deploy

migrate-create:
	@read -p "Migration name: " name; \
	docker compose exec app npx prisma migrate dev --name "$$name"

# Code quality
format:
	@echo "✨ Formatting code..."
	@npm run format || echo "Run 'npm install' first"

lint:
	@echo "🔍 Linting code..."
	@npm run lint || echo "Run 'npm install' first"

# Help
help:
	@echo "📖 Ariane World Builder - Available Commands"
	@echo ""
	@echo "Setup & Teardown:"
	@echo "  make setup          Setup containers (build and run)"
	@echo "  make clean          Quick cleanup (.next, node_modules, stop containers)"
	@echo "  make clear          Full teardown (interactive prompts)"
	@echo "  make reset          Full reset (teardown + setup)"
	@echo ""
	@echo "Container Control:"
	@echo "  make start          Start stopped containers"
	@echo "  make stop           Stop running containers"
	@echo "  make restart        Restart containers"
	@echo "  make logs           Follow container logs"
	@echo ""
	@echo "Development:"
	@echo "  make studio         Open Prisma Studio"
	@echo "  make shell          Open shell in app container"
	@echo "  make db-shell       Open PostgreSQL shell"
	@echo ""
	@echo "Database:"
	@echo "  make migrate        Apply pending migrations"
	@echo "  make migrate-create Create new migration"
	@echo ""
	@echo "Code Quality:"
	@echo "  make format         Format code with Prettier"
	@echo "  make lint           Lint code with ESLint"