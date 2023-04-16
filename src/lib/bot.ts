// ------------------------------------------------
//   Author(s): RMCJ < rmichael1001@gmail.com>
//   Project: OpenDiscordBot
//   Version: 1.0
//
//   Description: Bot API
//
// ------------------------------------------------

import { Client, GatewayIntentBits } from 'discord.js';
import { SlashCommandHandler } from '@lib/SlashCmdHandler';
import { BotEventHandler } from '@lib/BotEventHandler';
import { DeveloperSettings } from '@settings/devSettings';
import { logger } from '@lib/Logger';
import { TradCommandHandler } from '@lib/TradCmdHandler';

/** The Bot class is a TypeScript class that handles the creation and shutdown of a
Discord bot client, as well as the initialization of a command handler. */
export class Bot
{
    /** Configuration settings for the discord bot */
    config: DeveloperSettings;

    /** File path for root folder of the project */
    root: string;

    /** Command handler for the bot */
    commands: TradCommandHandler;

    /** Slash Command handler for the bot */
    slashCommands: SlashCommandHandler;

    events: BotEventHandler;

    /** Discord.js client */
    client: Client;

    logger;

    /**
     * This is a constructor function that initializes properties and creates
     * instances of the Bot class.
     * @param {string} projectRootPath - A string representing the root path of the
     * project.
     * @param {ConfigType} config - The `config` parameter is of type `ConfigType`
     * and likely contains configuration settings for the project.
     */
    constructor(projectRootPath: string, config: DeveloperSettings)
    {
        this.root = projectRootPath;
        this.config = config;

        this.commands = new TradCommandHandler(this.root, this.config);
        this.slashCommands = new SlashCommandHandler(this.root, this.config);

        this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
        this.events = new BotEventHandler(this.root, this.client);

        this.logger = logger;
    }

    /**
     * The function shuts down the discord bot client and exits the node 
     * process.
     * @returns {Promise<void>}
     */
    async shutdown(): Promise<void>
    {
        await this.logger.log("Shutting down...");

        this.client.destroy();

        await this.logger.log("Bot is shut down.");

        process.exit(0);
    }
}

