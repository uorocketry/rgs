# Docker

One of the most important requirements is [Docker](https://docs.docker.com/), it's how we set up the Database and Grafana server.

The easiest way to install it is by downloading [Docker Desktop](https://www.docker.com/products/docker-desktop) for your operating system.

After installing Docker you can now run the database with:

```sh
docker-compose up
```

The output should look something like this:

```txt
Starting rgs_db_1 ... done
...
Attaching to rgs_db_1, ...
```

Now check if you can connect to the database directly on a tool like [DBeaver](https://dbeaver.io/), you can use the following credentials:

```txt
Host: localhost:5432
Database: postgres
User: postgres
Password: password
Connection URL: postgres://postgres:postgres@localhost:5432/postgres
```

If everything goes right you'll be able to see some tables in the `public` schema.