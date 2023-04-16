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
import { Bot } from "./lib/Bot.ts";
import { NodeEventHandler } from "./lib/NodeEventHandler.ts";
import devSettings from "./settings/devSettings.ts";

// Initialize new BotProject object
export let bot = new Bot(__dirname, devSettings);

// Initialize new Node events handler
export const nodeEvents = new NodeEventHandler(__dirname);

// Load bot events
bot.events.loadEvents();

// Load node events
nodeEvents.loadEvents();

// Load all traditional commands

// Load all slash commands then register them
bot.slashCommands.loadAll();
bot.slashCommands.registerAll();

// Log in to Discord with your client's token
bot.client.login(devSettings.token);
