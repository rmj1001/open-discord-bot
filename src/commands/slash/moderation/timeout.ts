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

import { ChatInputCommandInteraction, GuildMember, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { SlashCommandType } from '@mytypes/SlashCommand';
import { bot } from 'index';

let s = 1;
let m = s * 60;
let h = m * 60;
let d = h * 24;
let w = d * 7;
let y = d * 365;

/**
 * Converts time string into miliseconds
 * 
 * @param timeExpr The string for the time
 * @returns number
 */
function durationSeconds(timeExpr: string): number
{
    let units: any = { 'd': d, 'h': h, 'm': m, 's': s };

    const regex = /(\d+)([dhms])/g;

    let seconds = 0;
    let match;

    while ((match = regex.exec(timeExpr))) 
    {
        seconds += parseInt(match[1]) * units[match[2]];
    }

    return seconds * 1000;
}

let slashCommand: SlashCommandType = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a user')
        .addUserOption(user => (
            user
                .setName('user')
                .setDescription("The user to time out.")
                .setRequired(true)
        ))
        .addStringOption(length => (
            length
                .setName('length')
                .setDescription("The length of time to time out for")
                .setRequired(true)
        ))
        .addStringOption(reason => (
            reason
                .setName('reason')
                .setDescription("The reason for the time out")
        ))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
    ownerOnly: false,
    async execute(interaction: ChatInputCommandInteraction)
    {
        if (!interaction.guild)
        {
            await interaction.reply("This command can only be used in guilds!");
        }

        const userId = interaction.options.getUser('user')!.id;
        const member = (interaction.guild?.members.cache.get(userId) as GuildMember);

        const timeString = interaction.options.getString('length')!;
        const timeregex = /(\d+)([dhms])/g;

        if (!timeregex.test(timeString))
        {
            await interaction.reply({ content: `Invalid time string: ${timeString}. Please use '#h #m #s' format.`, ephemeral: true });
            return;
        }

        const time = durationSeconds(timeString);

        if (time > (d * 28000))
        {
            await interaction.reply({
                content: "You cannot time someone out for longer than 28 days!",
                ephemeral: true
            });
            return;
        }

        const reason = interaction.options.getString('reason') || 'No reason given.';
        await member?.timeout(time, reason);

        await interaction.reply({ content: `Timed out ${member.displayName} for ${timeString}.`, ephemeral: true });
        return;
    },
};

module.exports = slashCommand;
