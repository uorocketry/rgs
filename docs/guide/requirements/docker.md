# Docker

One of the most important requirements is [Docker](https://docs.docker.com/), it's how we set up the Database and GraphQL server.

The easiest way to install it is by downloading [Docker Desktop](https://www.docker.com/products/docker-desktop) for your operating system.

After installing Docker you can now run the Database and GraphQL server part of the ground station by running:

```sh
docker-compose up
```

The output should look something like this:

```txt
Starting rgs_db_1 ... done
Starting rgs_migration_1 ... done
Starting rgs_hasura_1    ... done
Attaching to rgs_db_1, rgs_migration_1, rgs_hasura_1
...
```

Now check if you can open the Hasura console by going to <http://localhost:4000/console>!

If everything went right you should see something like this:

![Hasura Console](/static/hasura.png)

As a bonus, if you want to connect to the database directly on a tool like [DBeaver](https://dbeaver.io/), you can use the following credentials:

```txt
Host: localhost:5432
Database: postgres
User: postgres
Password: password
Connection URL: postgres://postgres:postgres@localhost:5432/postgres
```
