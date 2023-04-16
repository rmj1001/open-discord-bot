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
import { bot } from "../../../index";
import { SlashCommandType } from "../../../types/SlashCommand";

let slashCommand: SlashCommandType = {
    data: new SlashCommandBuilder()
        .setName('cmd')
        .setDescription('Bot command management (developer only)')
        .addSubcommand(load => (
            load
                .setName('load')
                .setDescription('Load a command')
                .addStringOption(command => (
                    command
                        .setName("command")
                        .setDescription("The command to load")
                ))
        ))
        .addSubcommand(unload =>
        (
            unload
                .setName('unload')
                .setDescription('Unload a command')
                .addStringOption(command => (
                    command
                        .setName("command")
                        .setDescription("The command to load")
                ))
        ))
        .addSubcommand(reload => (
            reload
                .setName('reload')
                .setDescription('Reload a command')
                .addStringOption(command => (
                    command
                        .setName("command")
                        .setDescription("The command to load")
                ))
        ))
        .addSubcommand(reloadAll => (
            reloadAll
                .setName('reload-all')
                .setDescription('Reload all commands')
        )),
    ownerOnly: true,
    async execute(interaction: ChatInputCommandInteraction)
    {
        const subCmd = interaction.options.getSubcommand();
        const cmd = interaction.options.getString('command');

        if (subCmd === 'load')
        {
            await bot.logger.log(`Command /cmd ${subCmd} was run.`);

            await interaction.reply
                (`Command /cmd ${subCmd} was run.`);
            return;
        }

        else if (subCmd === 'unload')
        {
            await bot.logger.log(`Command /cmd ${subCmd} was run.`);

            await interaction.reply
                (`Command /cmd ${subCmd} was run.`);
            return;
        }

        else if (subCmd === 'reload')
        {
            await bot.logger.log(`Command /cmd ${subCmd} was run.`);

            await interaction.reply
                (`Command /cmd ${subCmd} was run.`);
            return;
        }

        else if (subCmd === 'reload-all')
        {
            await bot.logger.log(`Command /cmd ${subCmd} was run.`);

            await interaction.reply
                (`Command /cmd ${subCmd} was run.`);
            return;
        }

        else
        {
            bot.logger.log(`Command /cmd ${subCmd} was run.`);

            await interaction.reply
                (`Command /cmd ${subCmd} was run.`);
            return;
        }
    },
};

module.exports = slashCommand;