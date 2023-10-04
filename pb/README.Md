# PB Service

This service is responsible for running the [pocketbase](<[https://](https://pocketbase.io/)>) server.

It also connects to the ZeroMQ network and records it to the database.

The migrations/setup scripts for the database in `pb_migrations`.

To change default admin passwords make sure to change ecosystem.config.js and pb_migrations/xxx_create_admin.js
