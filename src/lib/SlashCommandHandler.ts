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
import { DeveloperSettings } from '../settings/devSettings';
import { bot } from '../index';

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

    constructor(rootPath: string, config: DeveloperSettings)
    {
        // config
        this.config = config;

        // Root of project folder
        this.root = rootPath;

        // Path for slash commands folder
        this.commandsPath = path.join(this.root, 'commands', 'slashCommands');

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
                this.cmdJSONs.push(command.data.toJSON());
                this.commands.set(command.data.name, command);
                bot.logger.log(`START: Loaded slash command '${cmdName}'`);
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
        // this.slashCommandFiles = [];
        // this.slashCommandFolders = [];
        // this.slashCmds.clear();

        // for (let i = 0; i < this.slashCommandFiles.length; i++)
        // {
        //     let file = this.slashCommandFiles[i];
        //     let commandName = file.split('/')[-1].split('.ts')[0];
        //     let command = this.slashCmds.get(commandName);
        //     delete require.cache[require.resolve(`./${command.data.name}.ts`)];
        // }

        // TODO: De-register slash commands from Discord

        bot.logger.log("Slash command unloading not yet implemented.");
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
        this.registerAll();
    }

    /**
     * This function refreshes the application commands for a Discord bot.
     * 
     * @returns {Promise<void>}
     */
    async registerAll(): Promise<void>
    {
        try
        {
            bot.logger.log(`Started refreshing ${this.cmdJSONs.length} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await this.rest.put(
                Routes.applicationGuildCommands(this.config.clientId, this.config.devGuild.guildId),
                { body: this.cmdJSONs },
            );

            bot.logger.log(`Successfully reloaded ${this.cmdJSONs.length} application (/) commands.`);
        } catch (error)
        {
            // And of course, make sure you catch and log any errors!
            bot.logger.error(error);
        }
    }
};
