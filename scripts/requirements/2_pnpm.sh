# bin/bash -i

export SHELL=/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use node

echo '📥 Installing BUN'
curl -fsSL https://bun.sh/install | bash
