// ------------------------------------------------
//   Author(s): RMCJ < rmichael1001@gmail.com>
//   Project: OpenDiscordBot
//   Version: 1.0
//
//   Description: Bot API
//
// ------------------------------------------------

import { Client, GatewayIntentBits } from 'discord.js';
import { ConfigType } from '../settings/botconfig';
import { CommandHandler } from './CommandHandler';
import { BotEventHandler } from './BotEventHandler';

/** The Bot class is a TypeScript class that handles the creation and shutdown of a
Discord bot client, as well as the initialization of a command handler. */
export class Bot
{
    /** Configuration settings for the discord bot */
    config: ConfigType;

    /** File path for root folder of the project */
    root: string;

    /** Command handler for the bot */
    commands: CommandHandler;

    events: BotEventHandler;

    /** Discord.js client */
    client: Client;

    /**
     * This is a constructor function that initializes properties and creates
     * instances of the Bot class.
     * @param {string} projectRootPath - A string representing the root path of the
     * project.
     * @param {ConfigType} config - The `config` parameter is of type `ConfigType`
     * and likely contains configuration settings for the project.
     */
    constructor(projectRootPath: string, config: ConfigType)
    {
        this.root = projectRootPath;
        this.config = config;
        this.commands = new CommandHandler(this.root, this.config);
        this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
        this.events = new BotEventHandler(this.root, this.client);
    }

    /**
     * The function shuts down the discord bot client and exits the node 
     * process.
     * @returns {void}
     */
    shutdown(): void
    {
        console.log(`Shutting down...`);

        this.client.destroy();

        console.log(`Shut down.`);

        process.exit(0);
    }
}

