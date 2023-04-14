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
bot.commands.loadAllSlashCommands();
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
    const slashCommand = bot.commands.slashCmds.get(interaction.commandName);

    // If no traditional command or slash command was found
    if (!command && !slashCommand)
    {
        console.error(`No command matching ${interaction.commandName} was found.`);
        interaction.reply(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    // If the command was a traditional command, run its interaction.
    if (command)
    {
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
    }

    // If the command was a slash command, run its interaction
    if (slashCommand)
    {
        try
        {
            await slashCommand.execute(interaction);
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
