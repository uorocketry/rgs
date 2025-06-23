# Node

Though already installed with `devbox` to run node applications we also need to `cd` into their applications folder and run:

```sh
bun install
bun run dev
```

try it out with the `docs` folder.

Your terminal should look something like this:

![devcmd](/static/bundev.png)

If you can open it by going to <http://localhost:5173/rgs/> you are good to go!

::: tip

We might be using a custom development https certificate, you might be prompted to "Go back to safety" or "Accept the risk and continue". You can safely ignore this warning.

:::

## Troubleshooting

### Common mistakes

| Mistakes                                                           | Solution                                                        |
| ------------------------------------------------------------------ | --------------------------------------------------------------- |
| Running `npm install`                                              | Delete the `node_modules` folder and run `bun install` instead |
| Running as `sudo` (you should never run `npm` or `bun` as `sudo`) | Delete the `node_modules` folder and run `bun install` again   |


### bun install error ENOENT: no such file or directory

Are you sure you are in the correct folder?

### failed to load config from vite.config.js ERR_MODULE_NOT_FOUND

Are you sure you have installed the dependencies? Try running `bun install` and then `bun run dev` again.

### This site can’t be reached

Are you sure you are running the web app? Try running `bun run dev` again. Is the domain correct?
