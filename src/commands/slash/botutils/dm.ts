// ------------------------------------------------
//   Author(s): RMCJ < rmichael1001@gmail.com>
//   Project: OpenDiscordBot
//   Version: 1.0
//
//   Command: command
//   Usage: /command argument:type
//   Description: n/a
//
// ------------------------------------------------

import { ChannelType, ChatInputCommandInteraction, SlashCommandBuilder, TextChannel } from 'discord.js';
import { SlashCommandType } from '@mytypes/SlashCommand';
import { bot } from '@index';

let slashCommand: SlashCommandType = {
    data: new SlashCommandBuilder()
        .setName('dm')
        .setDescription('Send a direct message to a user.')
        .addUserOption(user => (
            user
                .setName('user')
                .setDescription('The user to direct message')
                .setRequired(true)
        ))
        .addStringOption(option => (
            option
                .setName('text')
                .setDescription("The text to echo.")
                .setRequired(true)
        )),
    ownerOnly: true,
    async execute(interaction: ChatInputCommandInteraction)
    {
        let user = interaction.options.getUser('user');
        let text = interaction.options.getString('text');

        await user?.send(`${text}`);
        await interaction.reply(`Messaged user ${user?.username}#${user?.discriminator}.`);
    },
};

module.exports = slashCommand;
