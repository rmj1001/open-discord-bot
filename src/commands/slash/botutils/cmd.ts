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

import { SlashCommandBuilder, ChatInputCommandInteraction, Interaction } from "discord.js";
import { bot } from "index";
import { SlashCommandType } from "@mytypes/SlashCommand";

let slashCommand: SlashCommandType = {
    data: new SlashCommandBuilder()
        .setName('cmd')
        .setDescription('Bot command management (developer only)')
        .addSubcommand(load => (
            load
                .setName('load')
                .setDescription('Load a command')
                .addBooleanOption(boo => (
                    boo
                        .setName("all")
                        .setDescription("Reload all commands?")
                ))
                .addStringOption(command => (
                    command
                        .setName("command")
                        .setDescription("The command to load")
                        .setAutocomplete(true)
                ))
        ))
        .addSubcommand(unload =>
        (
            unload
                .setName('unload')
                .setDescription('Unload a command')
                .addBooleanOption(boo => (
                    boo
                        .setName("all")
                        .setDescription("Reload all commands?")
                ))
                .addStringOption(command => (
                    command
                        .setName("command")
                        .setDescription("The command to load")
                        .setAutocomplete(true)
                ))
        ))
        .addSubcommand(reload => (
            reload
                .setName('reload')
                .setDescription('Reload a command')
                .addBooleanOption(boo => (
                    boo
                        .setName("all")
                        .setDescription("Reload all commands?")
                ))
                .addStringOption(command => (
                    command
                        .setName("command")
                        .setDescription("The command to load")
                        .setAutocomplete(true)
                ))
        )),
    ownerOnly: true,
    async autocomplete(c: ChatInputCommandInteraction)
    {
        const focusedValue = c.options.getFocused();
        let choices: string[] = [];

        bot.slashCommands.commands.forEach((v, k) =>
        {
            choices.push(k);
        });

        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await c.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },
    async execute(interaction: ChatInputCommandInteraction)
    {


        const subCmd = interaction.options.getSubcommand();
        const cmd = interaction.options.getString('command');
        const all = interaction.options.getBoolean(`all`);

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
            if (all)
            {
                await bot.logger.log(`Reloading all slash commands`);
                await interaction.reply(`Reloading slash commands...`);

                try
                {
                    await bot.slashCommands.reloadAll();
                    await interaction.followUp("Reload successful.");

                } catch (err)
                {
                    await bot.logger.error(err);
                    await interaction.followUp("Reload unsuccessful.");
                }
            }
        }

        else await interaction.reply(`Invalid subcommand`); return;
    },
};

module.exports = slashCommand;