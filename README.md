# RGS

The RGS repository contains the main infrastructure for the uORocketry Ground Station.

## About the infrastructure

The infrastructure is composed of the following components:

### Database

We are using a TimescaleDB instance for the database. The database schema is defined using the [Drizzle ORM](https://orm.drizzle.team) and we also use Hasura to expose a GraphQL API for consuming the data.

### Providers

The providers are the components that receive data from an external source (eg: The rocket or a sensor) and broadcast it to the rest of the infrastructure.

These are the `hydra_provider`, which receives data from the Hydra rocket and the `labjack_provider`, which receives data from the labjack sensors.

### Frontends

The frontends are the components that allow the user to interact with the infrastructure. At the moment only being the `web` frontend.

## How to run

There are a few things of interest that you might want to have running on your machine:

- [Docker](https://docs.docker.com/get-docker/) + [Docker Compose](https://docs.docker.com/compose/install/)
- The backend Database/Hasura instance which can be run with `docker compose up`
- The web frontend application. See its [README](web/README.md) for more information.
- The `hydra_provider` project which can provide usefull serial/development-random-data for the web frontend. See its [README](hydra_provider/README.md) for more information.
- Labjack Provider has not been implemented yet.

## Running with PM2

In addition, you can use [PM2](https://pm2.keymetrics.io/) as a process manager to run the stack. This is useful for running the ground station in case a process crashes.

- Run `pm2 start` to start the processes defined in the ecosystem file.
- See [PM2 Quick Start](https://pm2.keymetrics.io/docs/usage/quick-start/) for more information.

Note: For development purposes `hydra_provider` isn't included in the `pm2` ecosystem file. Check its [README](hydra_provider/README.md) for more information on how to run it.

## Troubleshooting

Please refer to each of the following for more information.

- [SvelteKit](https://kit.svelte.dev/docs/introduction) (Web Framework)
- [Hasura](https://hasura.io/docs/latest/index/) (GraphQL API)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview) (Database Schema)
- Slack (For general questions)
