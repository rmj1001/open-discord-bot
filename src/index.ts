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
import { config } from './config.ts';
import { NodeEventHandler } from "./lib/NodeEventHandler.ts";

// Initialize new BotProject object
export let bot = new Bot(__dirname, config);

// Initialize new Node events handler
export const nodeEvents = new NodeEventHandler(__dirname);

// Load bot events
bot.events.loadEvents();

// Load node events
nodeEvents.loadEvents();

// Load all slash commands then register them
bot.commands.loadAllSlashCommands();
bot.commands.registerSlashCommands();

// Log in to Discord with your client's token
bot.client.login(bot.config.token);
