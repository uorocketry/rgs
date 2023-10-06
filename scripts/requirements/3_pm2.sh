# bin/bash -i

if command -v pm2 &> /dev/null
then
    echo '✅ PM2 is already installed'
else 
    echo '📥 Installing PM2'
    pnpm install -g pm2
    echo '✅ PM2 installed'
fi