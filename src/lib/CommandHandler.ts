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
import { ConfigType } from '../settings/botconfig';
import { DeveloperSettings } from '../settings/devSettings';

/** The CommandHandler class is responsible for loading, unloading, and registering
slash commands for a Discord bot. */
export class CommandHandler
{
    /** Discord.js collection holding commands */
    cmds: Collection<any, any>;

    slashCmds: Collection<any, any>;

    /** Array of slash command JSONs */
    slashCmdJSONs: JSON[];

    /** Config settings from the Bot class */
    config: DeveloperSettings;

    /** File path for the root folder of the project */
    root: string;

    /** Path for the top-level commands folder */
    commandsPath: string;

    /** Array of path strings for containing command modules */
    commandFolders: string[];

    /** Array of path strings for files inside folder modules inside 
     * `src/commands` */
    commandFiles: string[];

    /** File path string for the folder containing slash command modules */
    slashCommandsPath: string;

    /** Array of path strings for slash command module folders */
    slashCommandFolders: string[];

    /** Array of path strings for slash command files inside module folders */
    slashCommandFiles: string[];

    /** REST instance for registering slash commands with Discord */
    private rest: REST;

    constructor(rootPath: string, config: DeveloperSettings)
    {
        // config
        this.config = config;

        // Root of project folder
        this.root = rootPath;

        // Path for commands folder
        this.commandsPath = path.join(this.root, 'commands', 'traditional');

        // Array of command modules (folder path strings)
        this.commandFolders = [];

        // Array of command files (file path strings)
        this.commandFiles = [];

        // Collection of saved commands
        this.cmds = new Collection();

        // Path for slash commands folder
        this.slashCommandsPath = path.join(this.root, 'commands', 'slashCommands');

        // Array of slash command modules (folder path strings)
        this.slashCommandFolders = [];

        // Array of slash command files (file path strings)
        this.slashCommandFiles = [];

        // Array of JSONs for slash commands
        this.slashCmdJSONs = [];

        // Collection of slash commands
        this.slashCmds = new Collection();

        // Establish REST route
        this.rest = new REST().setToken(this.config.token);
    }

    /**
     * This function loads all traditional command files from a specified 
     * directory and adds them to a collection, while also checking for 
     * required properties.
     * 
     * @returns {void}
     */
    loadAll(): void
    {
        // Load set of folder (module) names
        this.commandFolders = fs.readdirSync(this.commandsPath).filter(file =>
            fs.statSync(path.join(this.commandsPath, file)).isDirectory
        );

        for (let i = 0; i < this.commandFolders.length; i++)
        {
            let folder = path.join(this.commandsPath, this.commandFolders[i]);
            let fileNames = fs.readdirSync(folder).filter(file => file.endsWith('.ts'));

            for (let i = 0; i < fileNames.length; i++) 
            {
                this.commandFiles.push(path.join(folder, fileNames[i]));
            }
        }

        // Load each command file
        for (let i = 0; i < this.commandFiles.length; i++)
        {
            let file = this.commandFiles[i];
            let command = require(`${file}`);

            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'execute' in command)
            {
                this.cmds.set(command.data.name, command);
                this.slashCmdJSONs.push(command.data.toJSON());
                console.log(`START: Loaded command '${command.data.name}'`);
            } else
            {
                console.warn(`The command at ${file} is missing a required "data" or "execute" property.`);
            }
        }
    }

    /**
     * The function unloads all traditional command files and clears related 
     * data structures.
     * 
     * @returns {void}
     */
    unloadAll(): void
    {
        this.commandFiles = [];
        this.commandFolders = [];
        this.cmds.clear();

        for (let i = 0; i < this.commandFiles.length; i++)
        {
            let file = this.commandFiles[i];
            let commandName = file.split('/')[-1].split('.ts')[0];
            let command = this.cmds.get(commandName);
            delete require.cache[require.resolve(`./${command.data.name}.ts`)];
        }
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

    /**
     * The function unloads all slash command files and clears related 
     * data structures.
     * 
     * @returns {void}
     */
    loadAllSlashCommands(): void
    {
        // Load set of folder (module) names
        this.slashCommandFolders = fs.readdirSync(this.slashCommandsPath).filter(file =>
            fs.statSync(path.join(this.slashCommandsPath, file)).isDirectory
        );

        for (let i = 0; i < this.slashCommandFolders.length; i++)
        {
            let folder = path.join(this.slashCommandsPath, this.slashCommandFolders[i]);
            let fileNames = fs.readdirSync(folder).filter(file => file.endsWith('.ts'));

            for (let i = 0; i < fileNames.length; i++) 
            {
                this.slashCommandFiles.push(path.join(folder, fileNames[i]));
            }
        }

        // Load each command file
        for (let i = 0; i < this.slashCommandFiles.length; i++)
        {
            let file = this.slashCommandFiles[i];
            let command = require(`${file}`);

            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'execute' in command)
            {
                this.slashCmdJSONs.push(command.data.toJSON());
                this.slashCmds.set(command.data.name, command);
                console.log(`START: Loaded slash command '${command.data.name}'`);
            } else
            {
                console.warn(`The command at ${file} is missing a required "data" or "execute" property.`);
            }
        }
    }

    /**
     * This function refreshes the application commands for a Discord bot.
     * 
     * @returns {Promise<void>}
     */
    async registerSlashCommands(): Promise<void>
    {
        try
        {
            console.log(`Started refreshing ${this.slashCmdJSONs.length} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await this.rest.put(
                Routes.applicationGuildCommands(this.config.clientId, this.config.devGuild.guildId),
                { body: this.slashCmdJSONs },
            );

            console.log(`Successfully reloaded ${this.slashCmdJSONs.length} application (/) commands.`);
        } catch (error)
        {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    }

    /**
     * The function unloads all traditional command files and clears related 
     * data structures.
     * 
     * @returns {void}
     */
    unloadSlashCommands(): void
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

        console.log("Slash command unloading not yet implemented.");
    }

    /**
     * The function reloads all traditional commands by unloading and then 
     * loading them again.
     * 
     * @returns {void}
     */
    reloadSlashCommands(): void
    {
        this.unloadSlashCommands();
        this.loadAllSlashCommands();
        this.registerSlashCommands();
    }
};
