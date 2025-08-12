# Development Environment

If you're on linux you can skip this section.

If you're on windows you will need to install [Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/install).

If on Mac, you will likely want to install [Homebrew](https://brew.sh/).

Windows:

```sh
wsl --install
```

Mac:

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

The minimum you need to do to proceed is to install git.

Ubuntu (WSL):

```sh
sudo apt update && sudo apt install -y git
```

Mac:

```sh
brew install git
```

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
