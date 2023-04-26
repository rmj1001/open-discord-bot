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
import { Collection, REST, Routes } from 'discord.js';
import { DeveloperSettings } from '@settings/devSettings';
import { bot } from 'index';

/** The CommandHandler class is responsible for loading, unloading, and registering
slash commands for a Discord bot. */
export class SlashCommandHandler
{
    commands: Collection<any, any>;

    /** Array of slash command JSONs */
    cmdJSONs: JSON[];

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

    /**
     * This is a constructor function that initializes various properties and
     * collections for a TypeScript class.
     * @param {string} rootPath - A string representing the root path of the
     * project folder.
     * @param {DeveloperSettings} config - The `config` parameter is an object that
     * contains developer settings for the project. It is likely to include things
     * like the bot token, database credentials, and other configuration options.
     */
    constructor(rootPath: string, config: DeveloperSettings)
    {
        // config
        this.config = config;

        // Root of project folder
        this.root = rootPath;

        // Path for slash commands folder
        this.commandsPath = path.join(this.root, 'commands', 'slash');

        // Array of slash command modules (folder path strings)
        this.modules = new Collection();

        this.commandFiles = new Collection();

        // Array of JSONs for slash commands
        this.cmdJSONs = [];

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

    /**
     * This function populates a map of command files by iterating through the
     * modules and their respective file paths.
     * 
     * @returns {void}
     */
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
     * @returns {Promise<void>}
     */
    async loadAll(): Promise<void>
    {
        await bot.logger.log("Loading slash command files...");

        this.populateModules();
        this.populateCommands();

        this.commandFiles.forEach((cmdPath, cmdName) =>
        {
            let command = require(`${cmdPath}`);

            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && ('execute' in command || 'autocomplete' in command))
            {
                if (this.commands.get(command.data.name))
                {
                    bot.logger.warn(`Duplicated command for '${command.data.name}' at ${cmdPath}`);
                    delete require.cache[require.resolve(cmdPath)];
                }
                else
                {
                    this.cmdJSONs.push(command.data.toJSON());
                    this.commands.set(command.data.name, command);
                    bot.logger.log(`Loaded slash command '${cmdName}'`);
                }
            } else
            {
                bot.logger.warn(`The command at ${cmdPath} is missing a required "data" or "execute" property. Removing from cache.`);
                delete require.cache[require.resolve(cmdPath)];
            }
        });

        await bot.logger.log("Loaded all slash command files.");
    }

    /**
     * The function unloads all traditional command files and clears related 
     * data structures.
     * 
     * @returns {Promise<void>}
     */
    async unloadAll(): Promise<void>
    {
        await bot.logger.log("Unloading slash command files...");

        this.commandFiles.forEach(cmdPath =>
        {
            delete require.cache[require.resolve(cmdPath)];
        });

        this.modules.clear();
        this.commandFiles.clear();
        this.commands.clear();
        this.cmdJSONs = [];

        await bot.logger.log("Unloaded slash command files.");
    }

    /**
     * The function reloads all traditional commands by unloading and then 
     * loading them again.
     * 
     * @returns {Promise<void>}
     */
    async reloadAll(): Promise<void>
    {
        await this.unloadAll();
        await this.loadAll();
        await this.deRegisterAll();
        await this.registerAll();
    }

    /**
     * This function registers all slash commands for a Discord bot.
     * 
     * @returns {Promise<void>}
     */
    async registerAll(): Promise<void>
    {
        await bot.logger.log(`Registering ${this.cmdJSONs.length} application (/) commands...`);

        // The put method is used to fully refresh all commands in the guild with the current set
        await this.rest.put(
            Routes.applicationGuildCommands(this.config.clientId, this.config.devGuild.guildId),
            { body: this.cmdJSONs },
        ).then(async () =>
        {
            await bot.logger.log(`Successfully registered ${this.cmdJSONs.length} application (/) commands.`);
        }).catch(async error => (
            await bot.logger.error(error)
        ));
    }

    /**
     * This function de-registers all slash commands for a Discord bot.
     * 
     * @returns {Promise<void>}
     */
    async deRegisterAll(): Promise<void>
    {
        await bot.logger.log(`De-registering slash commands...`);

        await this.rest.put(
            Routes.applicationGuildCommands(this.config.clientId, this.config.devGuild.guildId),
            { body: [] },
        ).then(async () =>
        {
            await bot.logger.log('De-registering slash commands successful.');
        }).catch(async error =>
        {
            await bot.logger.log('De-registering slash commands unsuccessful.');
            await bot.logger.error(error);
        });
    }
}
