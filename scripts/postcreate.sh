# bin/bash -i

set -e

# Get the directory of this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

for script in $DIR/requirements/*.sh
do
  chmod +x $script
  $script   
done

echo ''
echo '🚀 You are almost ready to go!'
echo 'Re-open your terminal to update your environment'
echo ''
echo '📝 Running `pnpm install` will install all node deps'
echo '🦀 Running `cargo build` will install and compile all rust deps' 