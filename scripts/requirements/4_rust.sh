# bin/bash -i

if [ -d ~/.cargo ]
then
    echo '✅ RUST is already installed'
else
    echo '📥 Installing RUST'
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- --default-toolchain none -y
    . "$HOME/.cargo/env"
    rustup default stable
    echo '✅ RUST installed'
fi