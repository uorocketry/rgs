# Getting Started

## Overview

The Rocketry Ground Station (RGS) is a web-based ground station for uORocketry.

It is designed to be extensible and easy to use, with a focus on visualizing and logging data from the rocket.

## Tech Stack

The RGS infrastructure is made possible by combining the following technologies:

- [SvelteKit](https://kit.svelte.dev/docs/introduction) - A web framework that facilitates the development of visualization tools.
- [TimescaleDB](https://www.timescale.com/) - A PostgreSQL flavor that is optimized for time-series data.
- [Drizzle ORM](https://orm.drizzle.team/docs/overview) - A TypeScript-first ORM that is used to define the database schema.
- [Hasura](https://hasura.io/docs/latest/index/) - A GraphQL API that allows for easy access to real-time data.
- [Mavlink](https://mavlink.io/en/) - A lightweight protocol used for communication between the rocket and ground stations.