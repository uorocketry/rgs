# Development Environment

If you're on linux you can skip this section.

If you're on windows you will need to install [Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/install).

If on Mac, you will likelly want to install [Homebrew](https://brew.sh/).

::: code-group

```sh [Windows]
wsl --install

```

```sh [Mac]
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

:::

The minimum you need to do to proceed is to install git.

::: code-group

```sh [Ubuntu]
# Note that you will need to run this command inside the WSL terminal
sudo apt update && sudo apt install -y git
```

```sh [Mac]
brew install git
```

:::

You will now want to clone the repository. If you want to download it on a specific folder you can change directories by running `cd /path/to/your/folder` before running the `git clone` command.

```sh
git clone https://github.com/uorocketry/rgs 
cd rgs
```

If you have VSCode installed, you can open the repository by running `code .` inside the repository folder.

If you followed the steps above correctly you should see something like this:

![VSCode](/static/vscode.png)
> Don't worry about the extra widgets, I have a few extensions installed.
>
> We will cover some recommended extensions later.
