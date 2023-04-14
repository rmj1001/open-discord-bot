#!/bin/bash

# ------------------------------------------------
#   Author(s): RMCJ < rmichael1001@gmail.com>
#   Project: OpenDiscordBot
#   Version: 1.0
#
#   Description: Install project dependencies
#
#   Instructions: ./installDependencies
#
# ------------------------------------------------

clear
echo "Installing homebrew..."
sleep 5
curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh || {
    echo "Homebrew installation failed"
    sleep 2
    exit 1
}
echo "Homebrew Installed."
sleep 5

clear
echo "Installing NodeJS"
sleep 5
brew install node || {
    echo "Node installation failed"
    sleep 2
    exit 1
}
echo "NodeJS installed."

clear
echo "Installing project dependencies..."
sleep 5
npm install --global typescript discordjs ts-node || {
    echo "Dependency installation failed"
    sleep 2
    exit 1
}
echo "Project dependencies installed."
sleep 5
exit 0
