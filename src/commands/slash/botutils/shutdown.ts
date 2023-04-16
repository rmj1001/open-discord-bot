// ------------------------------------------------
//   Author(s): RMCJ < rmichael1001@gmail.com>
//   Project: OpenDiscordBot
//   Version: 1.0
//
//   Command: shutdown
//   Usage: /shutdown
//   Description: shuts down the bot
//
// ------------------------------------------------

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { bot } from 'index';
import { SlashCommandType } from '@mytypes/SlashCommand';

let slashCommand: SlashCommandType = {
    data: new SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('Shutdown the bot.'),
    ownerOnly: true,
    async execute(interaction: ChatInputCommandInteraction)
    {
        await interaction.reply('Shutting down...');
        bot.shutdown();
    },
};

module.exports = slashCommand;
