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
        .setName('echo')
        .setDescription('Echo some text')
        .addStringOption(option => (
            option
                .setName('text')
                .setDescription("The text to echo.")
                .setRequired(true)
        ))
        .addChannelOption(channel => (
            channel
                .setName('channel')
                .setRequired(false)
                .addChannelTypes(ChannelType.GuildText)
                .setDescription('The channel to send the echo to')
        )),
    ownerOnly: false,
    async execute(interaction: ChatInputCommandInteraction)
    {
        let text = interaction.options.getString('text');
        let channel = interaction.options.getChannel('channel');

        if (channel)
        {
            let txtChan = (bot.client.channels.cache.get(channel.id) as TextChannel);
            await txtChan.send(`${text}`);
            await interaction.reply(`Sent message to channel <#${txtChan.id}>.`);
            return;
        }

        await interaction.reply(`${text}`);
    },
};

module.exports = slashCommand;
