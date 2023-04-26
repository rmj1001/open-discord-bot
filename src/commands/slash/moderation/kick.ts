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

let slashCommand: SlashCommandType = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server!')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(user => (
            user
                .setName("user")
                .setDescription("The user to be kicked")
                .setRequired(true)
        ))
        .addStringOption(reason => (
            reason
                .setName("reason")
                .setDescription("The reason for the kick")
        )),
    ownerOnly: false,
    async execute(interaction: ChatInputCommandInteraction)
    {
        if (!interaction.guild)
        {
            await interaction.reply("This command must be run in a guild!");
            return;
        }

        const member = (interaction.guild.members.cache.get(interaction.options.getUser('user')!.id) as GuildMember);
        const reason = interaction.options.getString('reason') || "No reason provided.";

        await member.send(`__**Kick Notification**__\n**Server:** \`${interaction.guild.name}\`\n**Reason:**\n\`\`\`\n${reason}\n\`\`\``);

        await member.kick(reason);

        await interaction.reply({
            content: `Kicked ${member.displayName}.`,
            ephemeral: true
        });

        return;
    },
};

module.exports = slashCommand;
