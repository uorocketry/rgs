# Modifying the Database

Our schema lives in `db/seed.sql` and is applied using a small Bun script in `db/index.ts` which executes the SQL statements against LibSQL.

Steps to modify the database:

1) Edit `db/seed.sql` and add/adjust tables/indexes as needed.
2) Start your LibSQL instance (see Requirements → Docker).
3) Apply the schema with Bun:

```sh
cd db
bun run index.ts
```

If any statement fails, the script will print the failed SQL and exit non-zero.