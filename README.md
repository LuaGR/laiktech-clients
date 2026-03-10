# Configuración de Cotizaciones (Clientes) v2

Módulo full-stack para gestionar márgenes de precios y costos indirectos por planta para la plataforma Laiktech.

## Características

- Configuración de márgenes por tipo de cliente en 8 rangos de volumen fijos (300, 500, 1T, 3T, 5T, 10T, 20T, 30T)
- Alertas visuales cuando los márgenes son ≤ 5%
- Herencia a nivel de categoría: actualizar una cabecera de categoría se propaga a todos sus hijos
- Soporte para sobreescrituras manuales en celdas individuales
- Gestión de costos indirectos por planta (ej: Alquiler, Luz, Agua)

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Runtime | Node.js v.20 |
| Frontend | React 18, Apollo Client, TailwindCSS |
| Backend | Apollo Server (GraphQL), TypeScript |
| ORM | Prisma |
| Base de datos | PostgreSQL 15 |
| Infraestructura | Docker, Docker Compose |

## Arquitectura

### Backend — Screaming + Clean Architecture

Cada dominio de negocio es una carpeta de primer nivel con capas de Clean Architecture:

```
src/
├── Pricing/
│   ├── models/       Entidades de dominio
│   ├── services/     Lógica de negocio
│   └── adapters/     Resolvers GraphQL
└── Inventory/
    ├── models/
    ├── services/
    └── adapters/
```

### Frontend — Screaming + Clean Architecture + Scope Rule + Container/Presentational

Cada feature es una carpeta de primer nivel (Screaming) con capas de Clean Architecture internas (models, services, adapters, hooks). El Scope Rule determina dónde vive cada archivo. El Container es el punto de entrada en la raíz de la feature, los componentes presentacionales van en components/.

```
src/
├── pricing/
│   ├── models/               Tipos de la feature (.model.ts)
│   ├── services/             Lógica pura, sin React (.service.ts)
│   ├── adapters/             Queries/Mutations GraphQL (.adapter.ts)
│   ├── hooks/                React hooks (use-*.ts)
│   ├── pricing-container.tsx Container (raíz de la feature)
│   └── components/           Componentes presentacionales
├── costs/
├── plant/
├── shared/
└── layout/
```

## Inicio Rápido

### Prerrequisitos

- Docker y Docker Compose instalados

### Instalación con Script

```bash
git clone https://github.com/LuaGR/laiktech-clients.git
cd laiktech-clients
chmod +x setup.sh
./setup.sh
```

### Instalación con Makefile

```bash
make setup
```

### Comandos Disponibles (Makefile)

| Comando | Descripción |
|---------|-------------|
| `make build` | Construir imágenes Docker |
| `make up` | Iniciar contenedores |
| `make down` | Detener contenedores |
| `make restart` | Reiniciar todos los servicios |
| `make logs` | Ver logs de todos los servicios |
| `make logs-backend` | Ver logs del backend |
| `make logs-frontend` | Ver logs del frontend |
| `make migrate` | Ejecutar migraciones (dev) |
| `make seed` | Ejecutar seed de datos |
| `make studio` | Abrir Prisma Studio |
| `make clean` | Eliminar contenedores y volúmenes |

### Acceso

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend (GraphQL Playground) | http://localhost:4000 |
| PostgreSQL | localhost:5432 |

### Variables de Entorno

Configuradas automáticamente en `docker-compose.yml`. Para desarrollo local sin Docker, crear un archivo `.env` en `backend/`:

```
DATABASE_URL=postgresql://laiktech:laiktech_secret@localhost:5432/quotation_config
PORT=4000
```