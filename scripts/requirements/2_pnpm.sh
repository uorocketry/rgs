#!/bin/bash -i

export SHELL=/bin/bash

echo '📥 Installing PNPM'
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Adding pnpm to PATH
export PATH="$HOME/.local/share/pnpm:$PATH"

# source ~/.bashrc or source ~/.zshrc, depending on your shell
