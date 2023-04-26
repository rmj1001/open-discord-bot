import { Events, Interaction } from 'discord.js';
import { bot } from 'index';
import { BotEvent } from '@mytypes/BotEvent';
import { SlashCommandType } from '@mytypes/SlashCommand';

let event: BotEvent = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: Interaction)
    {
        if (!interaction.isChatInputCommand()) return;

        const command = bot.commands.commands.get(interaction.commandName);
        const slashCommand: SlashCommandType = bot.slashCommands.commands.get(interaction.commandName);

        // If no traditional command or slash command was found
        if (!command && !slashCommand)
        {
            bot.logger.error(`No command matching ${interaction.commandName} was found.`);
            await interaction.reply(`No command matching ${interaction.commandName} was found.`);
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
                bot.logger.error(error);
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
            // checks to see if the command is flagged as ownerOnly and the user isnt the owner
            if (slashCommand.ownerOnly && interaction.user.id !== bot.config.botOwnerId)
            {
                await interaction.reply("This command only works for the bot owner!");
                return;
            }

            try
            {
                await slashCommand.execute(interaction);
            } catch (error)
            {
                bot.logger.error(error);
                if (interaction.replied || interaction.deferred)
                {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else
                {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        }
    },
};

module.exports = event;
