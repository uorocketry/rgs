#!/bin/sh

echo "Running bootstrap.sh"
drizzleFolderPath="./drizzle"

# Create "./drizzle" folder if it doesn't exist
if [ ! -d "$drizzleFolderPath" ]; then
    mkdir "$drizzleFolderPath"
fi

package_manager="npm"

# Check if "./.npm_execpath" file exists
# If so, use the package manager specified in it
if [ -f "./.npm_execpath" ]; then
    package_manager=$(cat "./.npm_execpath" | tr -d '\n')
    rm "./.npm_execpath"
fi

echo "Using package manager: $package_manager"
$package_manager run up
$package_manager run push
./restore_hasura.sh

exit 0
