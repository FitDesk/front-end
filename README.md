# FitDesk FrontEnd

# 1.- Levantar el backend

## Levantar backend con docker compose

```bash
docker-compose up -d --build
```

## Apagar todo los contenedores

```bash
docker compose down
```

# 2. Instalar dependencias

```bash
bun install
```
# 3.Levantar el frontend  y json-server

```bash
bun run dev:full
backend -> http://localhost:3001
frontend -> http://localhost:5173
```