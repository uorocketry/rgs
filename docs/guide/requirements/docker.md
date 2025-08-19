# Docker

One of the most important requirements is [Docker](https://docs.docker.com/), it's how we set up the services and database.

The easiest way to install it is by downloading [Docker Desktop](https://www.docker.com/products/docker-desktop) for your operating system.

After installing Docker, bring up the dev stack (web, db, gateway, ingestor, dispatcher) with:

```sh
docker compose -f docker-compose.dev.yml up -d
```

Once up, services will connect to LibSQL at `http://db:8080` internally (see compose files). Apply the schema from your host:

```sh
cd db
bun run index.ts
```

To inspect LibSQL data, use a LibSQL/Turso-compatible client or service logs. The schema in `db/seed.sql` creates tables like `RadioFrame`, `Command`, and SBG sensor tables.