# Configuración de Cotizaciones (Clientes) v2

Módulo full-stack para gestionar márgenes de precios y costos indirectos por planta para la plataforma Laiktech.

## Características

- Configuración de márgenes por tipo de cliente en 8 rangos de volumen fijos (300, 500, 1T, 3T, 5T, 10T, 20T, 30T)
- Alertas visuales cuando los márgenes son ≤ 5%
- Herencia a nivel de tipo de cliente: actualizar una cabecera se propaga a todas las empresas del tipo
- Soporte para sobreescrituras manuales en celdas individuales con flag `isOverride`
- Gestión de costos indirectos por planta (ej: Alquiler, Luz, Agua)
- Navegación entre vistas: **Clientes** y **Costos indirectos** desde el sidebar
- Selección de planta activa por país (ej: Perú)

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
├── clients/
│   ├── models/       Entidades de dominio
│   ├── services/     Lógica de negocio
│   └── adapters/     Resolvers GraphQL
├── costs/
│   ├── models/
│   ├── services/
│   └── adapters/
└── shared/           Prisma singleton, utilidades comunes
```

### Frontend — Screaming + Clean Architecture + Scope Rule + Container/Presentational

Cada feature es una carpeta de primer nivel con capas internas. El Scope Rule determina dónde vive cada archivo: si algo se usa solo en un feature, vive local; si se usa en 2+ features, sube a `shared/`.

```
src/
├── clients/
│   ├── models/                  Tipos de la feature (.model.ts)
│   ├── services/                Lógica pura, sin React (.service.ts)
│   ├── graphql/                 Queries/Mutations (.query.ts, .mutation.ts)
│   ├── adapters/                Mapeo DTO Backend ↔ Frontend (.adapter.ts)
│   ├── hooks/                   React facade (use-*.ts)
│   ├── clients-container.tsx    Container (raíz de la feature)
│   └── components/              Componentes presentacionales
├── costs/
├── plant/
├── layout/
└── shared/                      Componentes y utilidades usados en 2+ features
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
| `make logs-db` | Ver logs de PostgreSQL |
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

## Desarrollo Local sin Docker

Si se prefiere correr los servicios directamente en la máquina:

```bash
# Base de datos (requiere PostgreSQL 15 corriendo localmente)
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

> **Importante:** cada vez que se modifique un archivo `.graphql` en el backend, es necesario reiniciar el servidor para que Apollo recargue el schema. Con `npm run dev` (tsx watch) basta con guardar el archivo para que se reinicie automáticamente.

## Diseño de Base de Datos

Ver [`docs/db-design.md`](./docs/db-design.md) para el diagrama entidad-relación completo y la explicación de la lógica de herencia de márgenes.

## Git

### Estrategia de Branching

```
main
├── chore/apollo-setup
├── chore/frontend-setup
├── feature/clients-api
├── feature/clients-ui
├── feature/costs-ui
└── feature/ui-polish
```

### Mantener la branch actualizada con main

```bash
git fetch origin
git rebase origin/main
```

### Conflicto en `schema.graphql`

Si otro desarrollador edita el mismo `schema.graphql`:

1. `git fetch origin && git rebase origin/main`
2. Abrir el archivo en conflicto y resolver manualmente — los dos bloques deben coexistir (no elegir uno sobre el otro sino integrarlos)
3. `git add backend/src/clients/adapters/client.graphql`
4. `git rebase --continue`
5. Reiniciar el servidor backend para que Apollo recargue el schema unificado
