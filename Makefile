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

.PHONY: setup clear reset start stop logs help

setup:
	$(SETUP_CMD)

clear:
	$(TEARDOWN_CMD)

reset:
	$(TEARDOWN_CMD)
	$(SETUP_CMD)

start:
	docker compose start

stop:
	docker compose stop

logs:
	@docker compose logs -f app

help:
	@echo "make setup     # Setup containers (build and run)"
	@echo "make clear     # Tear down containers (stop and remove)"
	@echo "make reset     # Full reset (teardown + setup)"
	@echo "make start     # Start stopped containers"
	@echo "make stop      # Stop running containers"
	@echo "make logs      # Listen for console logs"
