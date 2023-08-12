# RGS

In this repository you may find the following folders:

- bindings: Typescript type bindings for the rocket messages backend
- pocketbase: Pocketbase backend
- db: ZMQ data recorder
- web: Web interface application
  - io: Socket.IO server
- hydra_provider: Rocket data receiver and broadcaster

## How to run

Make sure you have installed the following installed:

- Rust
- NodeJS
  - pm2 (process manager)
  - pnpm (package manager)

To run the nodejs you can run:

> pm2 start ./ecosystem.config.js

See the pm2 documentation for more information.

### hydra_provider

To actually receive data you will also have to run the hydra_provider.

Check the **Build and run** section in this [README](https://github.com/uorocketry/rgs/blob/24ee2dd0feac205fe080345babce9c57cf63626b/hydra_provider/README.md)

### rgs-web

Make sure to read the database's [README](https://github.com/uorocketry/rgs/blob/main/rgs-web/db/README.Md)

```bash
# Create databse admin
cd db
# Run the server for 5 seconds and stop it
./pocketbase serve
# ctrl + c to close the server
# Now create the base admin
./pocketbase admin create admin@db.com adminadmin
../
# Now on web folder
cd web
pnpm install
pnpm dev
```

## Troubleshooting

Please refer to each of the following for more information.

- [uORocketry Wiki - Ground Station](https://avwiki.uorocketry.ca/en/Avionics/HYDRA/Software/Ground-Station) (Project Documentation)
- [ZeroMQ](https://zeromq.org/get-started/) (Proxy-Web Server Networking)
- [Socket.IO](https://socket.io/docs/v4/) (Web Server-Browser Networking)
- [SvelteKit](https://kit.svelte.dev/docs/introduction) (Web Framework)
