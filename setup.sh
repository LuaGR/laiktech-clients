#!/bin/bash

set -euo pipefail

echo "================================================"
echo "  Quotation Configuration (Clients) v2 - Setup"
echo "================================================"
echo ""

if ! command -v docker >/dev/null 2>&1; then
  echo "ERROR: Docker is not installed."
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "ERROR: Docker Compose is not available."
  exit 1
fi

echo "[1/5] Stopping previous containers and removing volumes..."
docker compose down -v --remove-orphans || true

echo ""
echo "[2/5] Building images..."
docker compose build --no-cache

echo ""
echo "[3/5] Starting containers..."
docker compose up -d

echo ""
echo "[4/5] Waiting for database..."
sleep 8

echo ""
echo "[5/5] Running migrations and seed..."
docker compose exec -T backend npx prisma migrate deploy
docker compose exec -T backend npx prisma db seed

echo ""
echo "================================================"
echo "  Setup complete!"
echo ""
echo "  Frontend:  http://localhost:5173"
echo "  Backend:   http://localhost:4000"
echo "  Database:  localhost:5432"
echo "================================================"
echo ""
echo "Useful commands:"
echo "  docker compose logs -f"
echo "  docker compose down"
