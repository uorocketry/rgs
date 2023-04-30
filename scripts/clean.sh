#!/bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"
cd ../

# Remove build and cache folders
rm -rf ./.pnpm-store ./rgs-web/node_modules ./rgs-web/.pnpm-lock.yaml ./rgs-web/.svelte-kit
rm -rf ./hydra_provider/target ./hydra_provider/Cargo.lock

