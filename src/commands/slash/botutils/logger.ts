// ------------------------------------------------
//   Author(s): RMCJ < rmichael1001@gmail.com>
//   Project: OpenDiscordBot
//   Version: 1.0
//
//   Command: reload
//   Usage: /cmd [load|unload|reload|reload-all] <cmd?>
//   Description: Reloads either the bot's commands or its config file
//
// ------------------------------------------------

import { SlashCommandBuilder, ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import { bot } from "index";
import { SlashCommandType } from "@mytypes/SlashCommand";

let slashCommand: SlashCommandType = {
    data: new SlashCommandBuilder()
        .setName('logger')
        .setDescription('Send log messages to the console')
        .addSubcommand(log => (
            log
                .setName('log')
                .setDescription('Send a log message to the console')
                .addStringOption(message => (
                    message
                        .setName('message')
                        .setDescription("The message to send to the console")
                ))
        ))
        .addSubcommand(warn =>
        (
            warn
                .setName('warn')
                .setDescription('Send a warning message to the console')
                .addStringOption(message => (
                    message
                        .setName('message')
                        .setDescription("The message to send to the console")
                ))
        ))
        .addSubcommand(error => (
            error
                .setName('error')
                .setDescription('Send an error message to the console')
                .addStringOption(message => (
                    message
                        .setName('message')
                        .setDescription("The message to send to the console")
                ))
        )),
    ownerOnly: true,
    async execute(interaction: ChatInputCommandInteraction)
    {
        const subCmd = interaction.options.getSubcommand();
        const message = interaction.options.getString('message', true);

        if (subCmd === 'log')
        {
            await bot.logger.log(`${message}`);
        }

        else if (subCmd === 'warn')
        {
            await bot.logger.warn(`${message}`);
        }
        else if (subCmd === 'error')
        {
            await bot.logger.error(`${message}`);
        }
        else
        {
            await interaction.reply(`Invalid subcommand ${subCmd}.`);
            return;
        }

        await interaction.reply(`Message sent to console.`);
    },
};

module.exports = slashCommand;