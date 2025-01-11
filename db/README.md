# DB

This folder contains database schema definitions and migration scripts. They are optimally ran inside a Docker container. But can also be ran manually.

## Database Setup

Our database needs to be set up before we can run the application. This is done by running the `bootstrap` script. This script will:

- Update the database schema using [Drizzle ORM](https://orm.drizzle.team)

### 🐳 Running in Docker

**This is the recommended way**, the [docker-compose.yml](../docker-compose.yml) file contains a `migration` service that runs the `bootstrap` script.
This script will automatically set up the database and run the migrations.

## Development

Changing the database schema is pretty easy. Just edit the files in the `schema/` folder and run `pnpm run push` to **update the database schema**.
Don't forget that database changes can break the application, so make sure to test your changes by rebuilding the application.

## Folder Structure

- `drizzle/` - Drizzle ORM metadata
- `schema/` - Database schema declared with [Drizzle ORM](https://orm.drizzle.team/docs/sql-schema-declaration)

- `scripts`
  - `bootstrap` - Pushes Drizzle schema
  - `dbConfig` - Miscelaneous path/environment configuration

- `Dockerfile` - Container image for running the `bootstrap` script
- `drizzle.config.js` - [Drizzle ORM configuration](https://orm.drizzle.team/kit-docs/config-reference)

