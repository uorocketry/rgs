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
    
    // Install ZSH completions
    echo '# PNPM configuration' >> ~/.zshrc
    echo 'PNPM_HOME="$HOME/.local/share/pnpm"' >> ~/.zshrc
    echo 'case ":$PATH:" in' >> ~/.zshrc
    echo '*":$PNPM_HOME:"*) ;;' >> ~/.zshrc
    echo '*) export PATH="$PNPM_HOME:$PATH" ;;' >> ~/.zshrc
    echo 'esac' >> ~/.zshrc

    echo '✅ PNPM installed'
fi
