# RGS

The RGS repository contains the main infrastructure for the uORocketry Ground Station.

## About the infrastructure

The infrastructure is composed of the following components:

### Providers

The providers are the components that receive data from an external source (eg: The rocket or a sensor) and broadcast it to the rest of the infrastructure.

These are the `hydra_provider`, which receives data from the Hydra rocket and the `labjack_provider`, which receives data from the labjack sensors.

### Frontends

The frontends are the components that allow the user to interact with the infrastructure. At the moment only being the `web` frontend.

### Other

We also have a `.devcontainer` folder which contains the configuration for a development container. You can use this if you don't want to install the dependencies on your machine.

The `scripts` folder contains miscellaneous scripts that are used for development.

The `bindings` folder contains the typescript bindings for the rocket messages backend.

## How to run

Make sure you have installed the following installed:

- [Rust](https://www.rust-lang.org/tools/install)
- libudev-dev
- inotify-tools
- [bun](https://bun.sh/)
  - pm2 (process manager) - `bun install -g pm2`

Then run the following commands:

```bash
bun install
pm2 start
```

If you want to monitor the running processes you can run `pm2 monit` or install the [Pm2 Explorer](https://marketplace.visualstudio.com/items?itemName=alex-young.pm2-explorer) extension for VSCode.

To stop `pm2` and its processes run `pm2 kill`.

For development convenience `hydra_provider` isn't included in the `pm2` ecosystem file. Check its [README](https://github.com/uorocketry/rgs/blob/24ee2dd0feac205fe080345babce9c57cf63626b/hydra_provider/README.md) for more information.

## Troubleshooting

Please refer to each of the following for more information.

- [uORocketry Wiki - Ground Station](https://avwiki.uorocketry.ca/en/Avionics/HYDRA/Software/Ground-Station) (Project Documentation)
- [SvelteKit](https://kit.svelte.dev/docs/introduction) (Web Framework)
- [PM2](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/) (Process Manager)
