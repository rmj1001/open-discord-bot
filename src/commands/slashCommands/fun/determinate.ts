// ------------------------------------------------
//   Author(s): RMCJ < rmichael1001@gmail.com>
//   Project: OpenDiscordBot
//   Version: 1.0
//
//   Command: determinate
//   Usage: /determinate
//   Description: GOTTA TURN THE WORLD INTO YOUR DANCE FLOOR
//
// ------------------------------------------------

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('determinate')
        .setDescription('GOTTA TURN THE WORLD INTO YOUR DANCE FLOOR'),
    async execute(interaction: ChatInputCommandInteraction)
    {
        let lyrics: string = `
Gotta turn the world into your dance floor
Determinate, determinate
Push until you can't and then demand more
Determinate, determinate
You and me together, we can make it better
Gotta turn the world into your dance floor
Determinate, determinate`;

        await interaction.reply(lyrics);
    },
};
