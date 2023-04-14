# Open Discord Bot

This project aims to provide an open-source alternative to modern public discord
bots. It is meant to be easily installed on a Linux or MacOS system.

## Project Dependencies

### [Homebrew](https://brew.sh)

- `node`

### NPM Dependencies

- `typescript`
- `discordjs`
- `ts-node`

## Project Instructions

My reccomendation is to install [Homebrew](https://brew.sh/), then install
NodeJS as a homebrew application, then install the programs listed above via
NPM.

The bot is meant to be run using `ts-node` to alleviate the tediousness of
transpiling typescript code to javascript and copying non-TS files to a separate
directory. To run the bot, go to the root folder of the project and run
`./run.sh` in your BASH or ZSH shell.
