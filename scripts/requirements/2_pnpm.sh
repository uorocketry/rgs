# bin/bash -i

export SHELL=/bin/bash

# Check if pnpm is installed
if [ -d ~/.local/share/pnpm ]
then
    echo '✅ PNPM is already installed'
else 
    echo '📥 Installing PNPM'
    curl -fsSL https://get.pnpm.io/install.sh | bash -
    PNPM_HOME="$HOME/.local/share/pnpm"
    case ":$PATH:" in
    *":$PNPM_HOME:"*) ;;
    *) export PATH="$PNPM_HOME:$PATH" ;;
    esac
    pnpm setup
    echo '✅ PNPM installed'
fi
