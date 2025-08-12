# Getting Started

## Overview

The Rocket Ground Station (RGS) holds the infrastructure for the next generation ground station for the University of Ottawa's Rocketry Team.

It is designed to be extensible and easy to use, with a focus on logging and visualizing data from the rocket.

## Tech Stack

The RGS infrastructure is built with:

- [SvelteKit](https://kit.svelte.dev/docs/introduction) — main dashboard/web UI
- [LibSQL](https://libsql.org/) — database, seeded by SQL (`db/seed.sql`) via a small Bun script (`db/index.ts`)
- [messages-prost](https://github.com/uorocketry/messages-prost) — Protobuf message types used over radio
- [MAVLink](https://mavlink.io/en/) — transport between ground and rocket
- Rust services — `telemetry-ingestor`, `command-dispatcher`, `sergw`
