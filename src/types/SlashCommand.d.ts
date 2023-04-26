import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

/**
 * Slash Command Type
 */
export type SlashCommandType = {
    data: any,
    ownerOnly?: boolean,
    async execute?(interaction: ChatInputCommandInteraction): Promise<void>;
    async autocomplete?(interaction: ChatInputCommandInteraction): Promise<void>;
};
