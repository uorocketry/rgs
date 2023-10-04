# bin/bash -i

# echo 'Updating system'
# sudo apt update && sudo apt upgrade -y

# echo 'Installing NVM'
# curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# echo 'Installing Node'
# nvm install node
# echo 'Installing pnpm'
curl -fsSL https://get.pnpm.io/install.sh | sh -
source ~/.bashrc
pnpm setup
echo 'Installing PM2'
pnpm install -g pm2
echo 'Installing project dependencies'
pnpm install

echo 'Installing rust'
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- --default-toolchain none -y
rustup default stable

echo 'Installing dev dependencies'
sudo apt-get install -y \
    pkg-config \
    libudev-dev