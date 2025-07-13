## 📦 How to use (Project Setup)

### ✅ Prerequisites

- [Docker](https://www.docker.com/) installed

This project includes two setup scripts for easy local installation using Docker:

### 🐧 For macOS/Linux/WSL users

Run this in your terminal:
```
chmod +x ./scripts/setup.sh
./scripts/setup.sh
```

This will:

    Check that Docker and Docker Compose are installed

    Create a .env file if missing (with default DB connection and secret)

    Build and start the containers (docker compose up --build)

    Wait for the PostgreSQL database to be ready

    Generate the Prisma client and run the first migration

### 🪟 For Windows users (PowerShell)

Run this in PowerShell (preferably as Administrator):
```
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
.\scripts\setup.ps1
```

    ⚠️ Note: By default, PowerShell blocks script execution (Restricted policy).
    You must allow local scripts using Set-ExecutionPolicy RemoteSigned once.

This will:

    Check Docker and Docker Compose availability

    Generate the .env file if missing

    Build and start the containers

    Run the Prisma migration

### 🔄 Environment defaults (from .env)

DATABASE_URL="postgresql://postgres:postgres@db:5432/mydb"
NEXTAUTH_SECRET="my-super-secret"

You can customize these values before running the script.
