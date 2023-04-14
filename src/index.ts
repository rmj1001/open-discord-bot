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
import { Bot } from "./bot.ts";
import { Events } from 'discord.js';
import { config } from './config.ts';

// Initialize new BotProject object
export let bot = new Bot(__dirname, config);

// Load all slash commands then register them
bot.commands.loadAllSlashes();
bot.commands.registerSlashCommands();

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
bot.client.once(Events.ClientReady, c =>
{
    console.log(`${bot.config.project} v${bot.config.version} has started.`);
});

// Command handling for slash and non-slash commands
bot.client.on(Events.InteractionCreate, async interaction =>
{
    if (!interaction.isChatInputCommand()) return;

    const command = bot.commands.cmds.get(interaction.commandName);

    if (!command)
    {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try
    {
        await command.execute(interaction);
    } catch (error)
    {
        console.error(error);
        if (interaction.replied || interaction.deferred)
        {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else
        {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

// Log in to Discord with your client's token
bot.client.login(bot.config.token);

// Listen for shutdown processes
process.on('SIGTERM', function ()
{
    bot.shutdown();
});

process.on('SIGINT', function ()
{
    bot.shutdown();
});
