.PHONY: build up down restart logs logs-backend logs-frontend logs-db migrate seed studio clean

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose down
	docker compose up -d

logs:
	docker compose logs -f

logs-backend:
	docker compose logs -f backend

logs-frontend:
	docker compose logs -f frontend

logs-db:
	docker compose logs -f postgres

migrate:
	docker compose exec backend npx prisma migrate dev

migrate-deploy:
	docker compose exec backend npx prisma migrate deploy

seed:
	docker compose exec backend npx prisma db seed

studio:
	docker compose exec backend npx prisma studio

clean:
	docker compose down -v
	docker system prune -f

setup:
	chmod +x setup.sh
	./setup.sh
