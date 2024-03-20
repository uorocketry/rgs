# Node

To run some of the front-end applications, you need to have Node.js installed. We recommend using [fnm](https://github.com/Schniz/fnm) as a version manager.

::: code-group

```sh [Ubuntu]
sudo apt update && sudo apt install -y curl unzip
curl -fsSL https://fnm.vercel.app/install | bash
```

```sh [Mac]
brew install  fnm
```

:::

Then you can install Node.js by running:

```sh
fnm install 20
fnm default 20
fnm use 20
```

We are using `pnpm` as a package manager, you can install it by running:

```sh
npm install -g pnpm
```

To test if everything is running try going to the `web` folder and running:

```sh
pnpm install
pnpm dev
```

Your terminal should look something like this:

![Web App](/static/web_install.png)

If you can open the web app by going to <http://localhost:3000> you are good to go!

::: tip

We are using a development https certificate, you might be prompted to "Go back to safety" or "Accept the risk and continue". You can safely ignore this warning.

:::

The home page should look something like this:

![Web App](/static/rgs_home.png)

## Troubleshooting

### Common mistakes

| Mistakes                                                           | Solution                                                        |
| ------------------------------------------------------------------ | --------------------------------------------------------------- |
| Running `npm install`                                              | Delete the `node_modules` folder and run `pnpm install` instead |
| Running as `sudo` (you should never run `npm` or `pnpm` as `sudo`) | Delete the `node_modules` folder and run `pnpm install` again   |


### pnpm error ERR_PNPM_NO_PKG_MANIFEST  or  ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND

Are you sure you are in the `web` folder? Try `cd web` and then run the commands again.

### failed to load config from vite.config.js ERR_MODULE_NOT_FOUND

Are you sure you have installed the dependencies? Try running `pnpm install` and then `pnpm dev` again.

### This site can’t be reached

Are you sure you are running the web app? Try running `pnpm dev` again.
