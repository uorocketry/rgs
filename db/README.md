# DB

This folder contains database schema definitions and migration scripts. They are optimally ran inside a Docker container. But can also be ran manually.

## Database Setup

Our database needs to be set up before we can run the application. This is done by running the `bootstrap` script. This script will:

- Update the database schema using [Drizzle ORM](https://orm.drizzle.team)
- Restore the Hasura database from the `hasura_dump/hdb_catalog.sql` file (this is needed for Hasura to work without extra configuration)

> Also see [Hasura Configuration](#hasura-configuration) on how to save and restore the Hasura database.

### 🐳 Running in Docker

**This is the recommended way**, the [docker-compose.yml](../docker-compose.yml) file contains a `migration` service that runs the `bootstrap` script.
This script will automatically set up the database and run the migrations.

## Development

Changing the database schema is pretty easy. Just edit the files in the `schema/` folder and run `pnpm run push` to **update the database schema**.
Don't forget that database changes can break the application, so make sure to test your changes by rebuilding the application.

## Folder Structure

- `drizzle/` - Drizzle ORM metadata
- `hasura_dump/` - Hasura initial database dump (do not edit manually)
- `schema/` - Database schema declared with [Drizzle ORM](https://orm.drizzle.team/docs/sql-schema-declaration)

- `scripts`
  - `bootstrap` - Pushes Drizzle schema and restores Hasura database
  - `dbConfig` - Miscelaneous path/environment configuration
  - `dump_hasura` - Dumps the Hasura database to `hasura_dump/hdb_catalog.sql`
  - `restore_hasura` - Restores the Hasura database from `hasura_dump/hdb_catalog.sql`

- `Dockerfile` - Container image for running the `bootstrap` script
- `drizzle.config.js` - [Drizzle ORM configuration](https://orm.drizzle.team/kit-docs/config-reference)

## Hasura Configuration

Hasura's configuration is defined in the hasura_dump folder.
To persist changes in configuration across setups, we need to dump the database and restore it when needed.

The Hasura dump shall be updated when any schema changes are made in order to keep the graphQL API up to date.
Also make sure to track the tables in the Data tab of the Hasura console.

### Dumping the Hasura database

1. Go to the Hasura console and go to the [metadata actions](http://localhost:4000/console/settings/metadata-actions) in the settings. Then click on "Reset metadata"
2. Click on the `Data` tab then `default`->`public` [here](http://localhost:4000/console/data/default/schema/public) and click `Track All` for both **Untracked tables or views** and **Untracked foreign-key relationships**
3. Run `pnpm run dump_hasura` on the console.
4. Commit the changes.
5. You might also want to re-run `docker-compose` as `docker-compose up --build` to make sure the changes are persisted.
