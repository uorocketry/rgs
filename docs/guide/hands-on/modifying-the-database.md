# Modifying the Database

Schema is defined in `db/seed.sql` and applied via `db/index.ts` (Bun script).

**Steps:**

1. Edit `db/seed.sql` (add/adjust tables/indexes)
2. Start LibSQL instance (see [Docker requirements](../requirements/docker.md))
3. Apply schema:

```sh
cd db
bun run index.ts
```

On failure, the script prints the failed SQL and exits non-zero.