# DB

This folder contains the database schema and migration scripts. They are optimally ran in a Docker container. But can also be ran manually.

## Database Setup

Our database needs to be set up before we can run the application. This is done by running the `bootstrap.sh` script. This script will:

- Update the database schema using [Drizzle ORM](https://orm.drizzle.team)
- Restore the Hasura database from the `dump/hdb_catalog.sql` file (this is needed for Hasura to work without extra configuration)

> Also see [Hasura Configuration](#hasura-configuration) on how to save and restore the Hasura database.

### 🐳 Running in Docker

**This is the recommended way**, the [docker-compose.yml](../docker-compose.yml) file contains a `timescaledb-setup` service that runs the `bootstrap.sh` script. This script will automatically set up the database and run the migrations.

## Folder Structure

- `drizzle/` - Drizzle ORM metadata
- `dump/` - Initial setup database dump
- `schema/` - Database schema declared with [Drizzle ORM](https://orm.drizzle.team/docs/sql-schema-declaration)

- `bootstrap.sh` - Initial setup script (can be ran by `timescaledb-setup` container but can also be ran manually)
- `Dockerfile` - Dockerfile for `timescaledb-setup` container
- `drizzle.config.js` - [Drizzle ORM configuration](https://orm.drizzle.team/kit-docs/config-reference)
- `dump_hasura.sh` - Script to dump Hasura's database to `dump/hdb_catalog.sql`
- `restore_hasura.sh` - Script to restore the Hasura database from `dump/hdb_catalog.sql`

## Hasura Configuration

Hasura's configuration is along with the database in the `hdb_catalog` schema. To persist this configuration along new setups, we need to dump the database and restore it when needed.

The Hasura dump shall be updated when any schema changes are made in order to keep the graphQL API up to date.

### Dumping the Hasura database

Since you're reading this section you probably changed the Hasura configuration and need to update the dump. To do this, you may do the following in order:

1. Reset the database schema here <http://localhost:8080/console/settings/metadata-actions>
2. Click on the `Data` tab then `default`->`public` and click `Track All` for both **Untracked tables or views** and **Untracked foreign-key relationships**
3. Run `pnpm run dump_hasura` on the console