# ------------------------------------------------
#   Author(s): RMCJ < rmichael1001@gmail.com>
#   Project: OpenDiscordBot
#   Version: 1.0
#
#   Description: Clear terminal screen and run the bot
#
#   Instructions: ./run.sh
#
# ------------------------------------------------

clear

echo "# ------------------------------------------------ #"
echo "#          OPEN DISCORD BOT - TERMINAL             #"
echo "# ------------------------------------------------ #"

directory=${PWD##*/}

if [[ "$directory" == "scripts" ]]; then

    ts-node ../src/index.ts

else

    cd scripts
    ts-node ../src/index.ts

fi
