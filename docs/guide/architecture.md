# Architecture

RGS uses a microservices architecture with decoupled components communicating through well-defined interfaces.

## Goals

- Decentralized data storage and visualization for multiple ground stations
- Decoupled I/O interface for rocket communication
- Real-time data visualization
- Reliable data persistence for analysis

## Services

- **telemetry-ingestor** (Rust) - Ingests MAVLink telemetry and stores in database
- **command-dispatcher** (Rust) - Monitors database for pending commands and sends via MAVLink
- **heartbeat** (Go) - Service health monitoring and status reporting
- **sergw** (Go) - Serial-to-TCP gateway for antenna/radio communication
- **gps-ingest** (Rust) - Streams GPS coordinates from MAVLink POSTCARD messages as JSON
- **web** (SvelteKit) - Dashboard frontend for visualization and control
- **tile_provider** - Map tile serving for the web dashboard
- **hydra_manager_daemon** (Rust/Axum) - REST API for managing SerGW services (port 3030)
- **dashboard** (Wails/Go) - Desktop application for Linux Flatpak and Windows