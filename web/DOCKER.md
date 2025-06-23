# Docker Setup for RGS Web Application

This document explains how to run the RGS web application using Docker.

## Prerequisites

- Docker and Docker Compose installed
- Bun runtime (for local development)

## Production Setup

### Build and Run

```bash
# Build and start all services
docker compose up --build

# Or run in detached mode
docker compose up --build -d
```

The web application will be available at:
- **Direct access**: http://localhost:3000
- **Through Traefik**: http://rgs.localhost

### Individual Service

```bash
# Build and run only the web service
docker compose up --build web

# Or build the image separately
docker build -t rgs-web ./web
docker run -p 3000:3000 rgs-web
```

## Development Setup

### Using Docker Compose Override

```bash
# Start development environment with hot reloading
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build web

# Or run in detached mode
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d web
```

### Direct Development

```bash
# Build development image
docker build -f Dockerfile.dev -t rgs-web-dev ./web

# Run with volume mounting for hot reloading
docker run -p 3000:3000 -v $(pwd):/usr/src/app rgs-web-dev
```

## Docker Images

### Production Image (`Dockerfile`)
- Multi-stage build for optimized production image
- Uses `@sveltejs/adapter-node` for server-side rendering
- Runs as non-root user for security
- Exposes port 3000

### Development Image (`Dockerfile.dev`)
- Single-stage build for faster iteration
- Includes all devDependencies
- Supports hot reloading with volume mounting
- Runs development server with `bun run dev`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Node.js environment |
| `PORT` | `3000` | Application port |
| `WEB_SERVER_PORT` | `3000` | Vite dev server port |

## Troubleshooting

### Build Issues
```bash
# Clean build cache
docker builder prune

# Rebuild without cache
docker compose build --no-cache web
```

### Port Conflicts
If port 3000 is already in use, modify the port mapping in docker-compose.yml:
```yaml
ports:
  - "3001:3000"  # Map host port 3001 to container port 3000
```

### Permission Issues
The production container runs as a non-root user. If you encounter permission issues:
```bash
# Check container logs
docker compose logs web

# Run as root for debugging (not recommended for production)
docker run --user root -p 3000:3000 rgs-web
```

## Integration with Traefik

The web service is configured to work with Traefik reverse proxy:
- Host rule: `rgs.localhost`
- Entrypoint: `web` (port 80)
- Health checks enabled

To access through Traefik, ensure your `/etc/hosts` includes:
```
127.0.0.1 rgs.localhost
``` 