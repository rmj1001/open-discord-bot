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

import { bot } from '../../index';
import { SlashCommandBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('Shutdown the bot.'),
    async execute(interaction: any)
    {
        await interaction.reply('Shutting down...');
        bot.shutdown();
    },
};
