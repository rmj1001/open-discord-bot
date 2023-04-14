// ------------------------------------------------
//   Author(s): RMCJ < rmichael1001@gmail.com>
//   Project: OpenDiscordBot
//   Version: 1.0
//
//   Command: reload
//   Usage: /reload function:[Commands|Configuration]
//   Description: Reloads either the bot's commands or its config file
//
// ------------------------------------------------

import { SlashCommandBuilder, Interaction, ChatInputCommandInteraction } from "discord.js";
import { bot } from "../../index";
import { config } from "../../config";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads a command.')
        .addStringOption(option =>
            option.setName('function')
                .setDescription('Choose what to reload.')
                .setRequired(true)
                .addChoices(
                    { name: 'Commands', value: "commands" },
                    { name: 'Configuration', value: "config" }
                )),
    async execute(interaction: ChatInputCommandInteraction)
    {
        // ...
        const fn = interaction.options.getString('function');

        if (fn == 'commands')
        {
            // Reload commands
            bot.commands.reloadAll();

            // Confirmation msgs
            await interaction.reply("Reloaded all commands.");
            console.log("Reloaded all commands.");
        } else if (fn == 'config')
        {
            // // Reload config
            // bot.config = config;

            // // Confirmation msgs
            // await interaction.reply("Reloaded bot config.");
            // console.log("Reloaded bot config.");
            await interaction.reply("This command is disabled for now as it breaks the bot.");
        }
    },
};