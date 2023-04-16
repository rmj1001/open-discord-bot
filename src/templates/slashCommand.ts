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

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { SlashCommandType } from '@mytypes/SlashCommand';
import { bot } from 'index';

let slashCommand: SlashCommandType = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    ownerOnly: false,
    async execute(interaction: ChatInputCommandInteraction)
    {
        if (this.ownerOnly === true && interaction.user.id !== bot.config.botOwnerId) return;

        // code here
    },
};

module.exports = slashCommand;
