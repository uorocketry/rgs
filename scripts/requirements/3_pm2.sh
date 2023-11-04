# bin/bash -i

export SHELL=/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use node

echo '📥 Installing PM2'
npm install -g pm2
echo '✅ PM2 installed'