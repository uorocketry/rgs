# RGS

In this repository you may find the:

- Rocket Proxy Server
  - hydra_provider: The ZeroMQ proxy server
- Rocket Ground Station Web Application
  - rgs-web: The web application
  - ws-server: The websocket server

## How to run

The application can be run locally by using the following commands:

### rgs-web

```bash
cd rgs-web
pnpm install
pnpm dev
```

### hydra_provider

```bash
cargo build
cargo run -- -r -z 3002
```

## Troubleshooting

Please refer to each of the following for more information.

- [uORocketry Wiki - Ground Station](https://avwiki.uorocketry.ca/en/Avionics/HYDRA/Software/Ground-Station) (Project Documentation)
- [ZeroMQ](https://zeromq.org/get-started/) (Proxy-Web Server Networking)
- [Socket.IO](https://socket.io/docs/v4/) (Web Server-Browser Networking)
- [SvelteKit](https://kit.svelte.dev/docs/introduction) (Web Framework)
