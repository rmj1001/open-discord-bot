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
import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js';
import { ConfigType } from './config';

export class Bot
{
    config: ConfigType;
    root: string;
    commands: CommandHandler;
    client: Client;

    constructor(projectRootPath: string, config: ConfigType)
    {
        this.root = projectRootPath;
        this.config = config;
        this.commands = new CommandHandler(this.root, this.config);
        this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
    }

    shutdown(): void
    {
        console.log(`Shutting down...`);

        this.client.destroy();

        console.log(`Shut down.`);

        process.exit(0);
    }
}

export class CommandHandler
{
    cmds: Collection<any, any>;
    slashCmds: JSON[];

    config: ConfigType;

    root: string;

    commandsPath: string;
    commandFolders: string[];
    commandFiles: string[];

    slashCommandsPath: string;
    slashCommandFolders: string[];
    slashCommandFiles: string[];

    private rest: REST;

    constructor(rootPath: string, config: ConfigType)
    {
        // config
        this.config = config;

        // Root of project folder
        this.root = rootPath;

        // Path for commands folder
        this.commandsPath = path.join(this.root, 'commands');

        // Array of command modules (folder path strings)
        this.commandFolders = [];

        // Array of command files (file path strings)
        this.commandFiles = [];

        // Collection of saved commands
        this.cmds = new Collection();

        // Path for slash commands folder
        this.slashCommandsPath = path.join(this.root, 'slashCommands');

        // Array of slash command modules (folder path strings)
        this.slashCommandFolders = [];

        // Array of slash command files (file path strings)
        this.slashCommandFiles = [];

        // Collection of slash commands
        this.slashCmds = [];

        // Establish REST route
        this.rest = new REST().setToken(this.config.token);
    }

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
                this.slashCmds.push(command.data.toJSON());
                console.log(`START: Loaded command '${command.data.name}'`);
            } else
            {
                console.warn(`The command at ${file} is missing a required "data" or "execute" property.`);
            }
        }
    }

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

    reloadAll(): void
    {
        this.unloadAll();
        this.loadAll();
    }

    loadAllSlashes(): void
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
                this.slashCmds.push(command.data.toJSON());
                this.cmds.set(command.data.name, command);
                console.log(`START: Loaded slash command '${command.data.name}'`);
            } else
            {
                console.warn(`The command at ${file} is missing a required "data" or "execute" property.`);
            }
        }
    }

    async registerSlashCommands()
    {
        try
        {
            console.log(`Started refreshing ${this.slashCmds.length} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await this.rest.put(
                Routes.applicationGuildCommands(this.config.clientId, this.config.guildId),
                { body: this.slashCmds },
            );

            console.log(`Successfully reloaded ${this.slashCmds.length} application (/) commands.`);
        } catch (error)
        {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    }
};
