import { SlashCommandBuilder } from "discord.js";

/**
 * Slash Command Type
 */
export type SlashCommandType = {
    data: SlashCommandBuilder,
    async execute(interaction: ChatInputCommandInteraction): Promise<void>;
};
