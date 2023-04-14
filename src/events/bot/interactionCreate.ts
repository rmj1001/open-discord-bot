import { Events, Interaction } from 'discord.js';
import { bot } from '../../index';

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: Interaction)
    {
        if (!interaction.isChatInputCommand()) return;

        const command = bot.commands.cmds.get(interaction.commandName);
        const slashCommand = bot.commands.slashCmds.get(interaction.commandName);

        // If no traditional command or slash command was found
        if (!command && !slashCommand)
        {
            console.error(`No command matching ${interaction.commandName} was found.`);
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
    },
};