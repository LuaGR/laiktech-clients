#!/bin/bash

set -e

echo "================================================"
echo "  Quotation Configuration (Clients) v2 - Setup"
echo "================================================"
echo ""

if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    echo "ERROR: Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "[1/5] Building Docker images..."
docker compose build

echo ""
echo "[2/5] Starting containers..."
docker compose up -d

echo ""
echo "[3/5] Waiting for PostgreSQL to be ready..."
sleep 5

echo ""
echo "[4/5] Running database migrations..."
docker compose exec backend npx prisma migrate deploy

echo ""
echo "[5/5] Seeding database..."
docker compose exec backend npx prisma db seed

echo ""
echo "================================================"
echo "  Setup complete!"
echo ""
echo "  Frontend:  http://localhost:5173"
echo "  Backend:   http://localhost:4000"
echo "  Database:  localhost:5432"
echo "================================================"
