# Getting Started

RGS (Rocket Ground Station) infrastructure for the University of Ottawa's Rocketry Team. Extensible system for logging and visualizing rocket telemetry.

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/docs/introduction) — Dashboard/web UI
- [LibSQL](https://libsql.org/) — Database (schema: `db/seed.sql`, migration: `db/index.ts`)
- [messages-prost](https://github.com/uorocketry/messages-prost) — Protobuf message types
- [MAVLink](https://mavlink.io/en/) — Ground-to-rocket transport
- **Rust services**: `telemetry-ingestor`, `command-dispatcher`, `gps-ingest`, `hydra_manager_daemon`
- **Go services**: `sergw`, `heartbeat`
- **Desktop**: `dashboard` (Wails/Go) for Linux and Windows
