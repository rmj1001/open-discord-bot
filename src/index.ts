// ------------------------------------------------
//   Author(s): RMCJ < rmichael1001@gmail.com>
//   Project: OpenDiscordBot
//   Version: 1.0
//
//   Description: Main project file
//
//   Instructions: ts-node index.ts
//
// ------------------------------------------------

// Imports
import { Bot } from "@lib/Bot.ts";
import { NodeEventHandler } from "@lib/NodeEventHandler.ts";
import devSettings from "@settings/devSettings.ts";

// Initialize new BotProject object
export const bot = new Bot();

// Initialize new Node events handler
export const nodeEvents = new NodeEventHandler(bot.config.rootFolder);

let header = `\n# ------------------------------------------------ #`;
header = `${header}\n#                 OPEN DISCORD BOT                 #`;
header = `${header}\n# ------------------------------------------------ #`;

async function initializeBot()
{
    await bot.logger.log(header);

    // Load bot events
    bot.events.loadEvents();

    // Load node events
    nodeEvents.loadEvents();

    // Log in to Discord with your client's token
    await bot.client.login(devSettings.token);

    // Load all slash commands then register them
    await bot.slashCommands.loadAll();

    await bot.slashCommands.registerAll();

    // Load all traditional commands
    bot.commands.loadAll();

}

initializeBot();
