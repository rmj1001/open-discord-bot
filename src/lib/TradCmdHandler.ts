// ------------------------------------------------
//   Author(s): RMCJ < rmichael1001@gmail.com>
//   Project: OpenDiscordBot
//   Version: 1.0
//
//   Description: Bot API
//
// ------------------------------------------------

import * as path from 'path';
import * as fs from 'fs';
import { Collection, REST } from 'discord.js';
import { DeveloperSettings } from '@settings/devSettings';
import { bot } from 'index';

/** The CommandHandler class is responsible for loading, unloading, and registering
slash commands for a Discord bot. */
export class TradCommandHandler
{
    commands: Collection<any, any>;

    /** Config settings from the Bot class */
    config: DeveloperSettings;

    /** File path for the root folder of the project */
    root: string;

    /** File path string for the folder containing slash command modules */
    commandsPath: string;

    /** Array of path strings for slash command module folders */
    modules: Collection<string, string>;

    commandFiles: Collection<string, string>;

    /** REST instance for registering slash commands with Discord */
    private rest: REST;

    constructor(rootPath: string, config: DeveloperSettings)
    {
        // config
        this.config = config;

        // Root of project folder
        this.root = rootPath;

        // Path for slash commands folder
        this.commandsPath = path.join(this.root, 'commands', 'legacy');

        // Array of slash command modules (folder path strings)
        this.modules = new Collection();

        this.commandFiles = new Collection();

        // Collection of slash commands
        this.commands = new Collection();

        // Establish REST route
        this.rest = new REST().setToken(this.config.token);
    }

    /**
     * Load command file names into a collection
     * 
     * @returns {void}
     */

    populateModules(): void
    {
        // Populate this.modules
        fs.readdirSync(this.commandsPath).filter(file =>
            fs.statSync(path.join(this.commandsPath, file)).isDirectory
        ).forEach(moduleName =>
        {
            this.modules.set(moduleName, `${path.join(this.commandsPath, moduleName)}`);
        });

    }

    populateCommands(): void
    {
        this.modules.forEach((modulePath, moduleName) =>
        {
            fs.readdirSync(modulePath).filter(file => file.endsWith('.ts'))
                .forEach(name =>
                {
                    let file = path.join(modulePath, name);
                    this.commandFiles.set(
                        name.split('.ts')[0], `${file}`
                    );
                });
        });
    }

    /**
     * The function unloads all slash command files and clears related 
     * data structures.
     * 
     * @returns {void}
     */
    loadAll(): void
    {
        this.populateModules();
        this.populateCommands();

        this.commandFiles.forEach((cmdPath, cmdName) =>
        {
            let command = require(`${cmdPath}`);

            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'execute' in command)
            {
                this.commands.set(command.data.name, command);
                bot.logger.log(`START: Loaded traditional command '${cmdName}'`);
            } else
            {
                bot.logger.warn(`The command at ${cmdPath} is missing a required "data" or "execute" property. Removing from cache.`);
                delete require.cache[require.resolve(cmdPath)];
            }
        });
    }

    /**
     * The function unloads all traditional command files and clears related 
     * data structures.
     * 
     * @returns {void}
     */
    unloadAll(): void
    {
        this.commandFiles.forEach(cmdPath =>
        {
            delete require.cache[require.resolve(cmdPath)];
        });

        this.modules.clear();
        this.commandFiles.clear();
        this.commands.clear();
    }

    /**
     * The function reloads all traditional commands by unloading and then 
     * loading them again.
     * 
     * @returns {void}
     */
    reloadAll(): void
    {
        this.unloadAll();
        this.loadAll();
    }
};
