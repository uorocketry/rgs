#!/bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"
cd ../

# Remove build and cache folders
rm -rf ./.pnpm-store ./web/node_modules ./web/.pnpm-lock.yaml ./web/.svelte-kit
rm -rf ./hydra_provider/target ./hydra_provider/Cargo.lock

