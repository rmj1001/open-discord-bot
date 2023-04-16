// ------------------------------------------------
//   Author(s): RMCJ < rmichael1001@gmail.com>
//   Project: OpenDiscordBot
//   Version: 1.0
//
//   Command: ping
//   Usage: /ping
//   Description: Pong!
//
// ------------------------------------------------

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { bot } from '../../../index';
import { SlashCommandType } from '../../../types/SlashCommand';

let slashCommand: SlashCommandType = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction: ChatInputCommandInteraction)
    {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });

        await interaction.editReply(`🏓 Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms.\n🏓 API Latency is ${Math.round(bot.client.ws.ping)}ms.`);
    },
};

module.exports = slashCommand;
