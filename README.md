# RGS

The RGS repository contains the main infrastructure for the uORocketry Ground Station.

## About the infrastructure

The infrastructure is composed of the following components:

### Database

We are using a LibSQL instance for the database. The database schema is defined in SQL files (`db/seed.sql`) and applied via a Bun script (`db/index.ts`).

### Services

The infrastructure consists of several services that handle different aspects of the ground station:

- `telemetry-ingestor` - Ingests MAVLink telemetry from rockets
- `command-dispatcher` - Sends commands to rockets via MAVLink
- `heartbeat` - Service health monitoring
- `sergw` - Serial-to-TCP gateway for antenna/radio communication
- `gps-ingest` - GPS data processing
- `web` - SvelteKit dashboard frontend
- `tile_provider` - Map tile serving
- `hydra_manager_daemon` - Service management daemon for starting/stopping SerGW services
- `dashboard` - Desktop application (Wails/Go) for Linux Flatpak and Windows builds

### Frontends

The frontends are the components that allow the user to interact with the infrastructure. At the moment only being the `web` frontend.

## How to run

There are a few things of interest that you might want to have running on your machine:

- [Docker](https://docs.docker.com/get-docker/) + [Docker Compose](https://docs.docker.com/compose/install/)
- The full stack can be run with `docker compose up` (see `docker-compose.yml` for all services)
- The web frontend application. See its [README](web/README.md) for more information.

## Misc

Quickly stopping all containers: docker compose down --remove-orphans -t 0

Rebuilding the containers: docker compose up --build

## Deck launch arguments

Program

```
"flatpak"
```

Arguments

```
run --env=CHROME_PASSWORD_STORE=basic org.chromium.Chromium --app="http://10.0.0.142/" --start-fullscreen --noerrdialogs --disable-infobars --disable-translate --enable-features=OverlayScrollbar --overscroll-history-navigation=0 --disable-pinch --ozone-platform=x11
```

## Troubleshooting

Please refer to each of the following for more information.

- [SvelteKit](https://kit.svelte.dev/docs/introduction) (Web Framework)
- [LibSQL](https://libsql.org/) (Database)
- Slack (For general questions)


# Reset perms

sudo chown -R "$USER":"$USER" . && sudo chmod -R 0777 .
chmod -R 0777 db/data
