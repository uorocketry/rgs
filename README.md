# RGS

In this repository you may find the:

- Rocket Proxy Server
  - hydra_provider: The ZeroMQ proxy server
- Rocket Ground Station Web Application
  - rgs-web: The web application
    - io: Socket.IO proxy server
    - db: Persistent storage backend

## How to run

### hydra_provider

Check the **Build and run** section in this [README](https://github.com/uorocketry/rgs/blob/24ee2dd0feac205fe080345babce9c57cf63626b/hydra_provider/README.md)


### rgs-web

Make sure to read the database's [README](https://github.com/uorocketry/rgs/blob/main/rgs-web/db/README.Md)

```bash
cd rgs-web
# Create databse admin
cd db
./pocketbase admin create admin@db.com adminadmin
../
# Now on rgs-web folder
pnpm install
pnpm dev
```

## Troubleshooting

Please refer to each of the following for more information.

- [uORocketry Wiki - Ground Station](https://avwiki.uorocketry.ca/en/Avionics/HYDRA/Software/Ground-Station) (Project Documentation)
- [ZeroMQ](https://zeromq.org/get-started/) (Proxy-Web Server Networking)
- [Socket.IO](https://socket.io/docs/v4/) (Web Server-Browser Networking)
- [SvelteKit](https://kit.svelte.dev/docs/introduction) (Web Framework)
