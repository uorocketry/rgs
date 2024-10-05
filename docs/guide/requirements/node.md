# Node

Though already installed with `devbox` to run node applications we also need to `cd` into their applications folder and run:

```sh
pnpm install
pnpm dev
```

try it out with the `docs` folder.

Your terminal should look something like this:

![devcmd](/static/pnpmdev.png)

If you can open it by going to <http://localhost:5173/rgs/> you are good to go!

::: tip

We might be using a custom development https certificate, you might be prompted to "Go back to safety" or "Accept the risk and continue". You can safely ignore this warning.

:::

## Troubleshooting

### Common mistakes

| Mistakes                                                           | Solution                                                        |
| ------------------------------------------------------------------ | --------------------------------------------------------------- |
| Running `npm install`                                              | Delete the `node_modules` folder and run `pnpm install` instead |
| Running as `sudo` (you should never run `npm` or `pnpm` as `sudo`) | Delete the `node_modules` folder and run `pnpm install` again   |


### pnpm error ERR_PNPM_NO_PKG_MANIFEST  or  ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND

Are you sure you are in the correct folder?

### failed to load config from vite.config.js ERR_MODULE_NOT_FOUND

Are you sure you have installed the dependencies? Try running `pnpm install` and then `pnpm dev` again.

### This site can’t be reached

Are you sure you are running the web app? Try running `pnpm dev` again. Is the domain correct?
