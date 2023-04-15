import { Events } from "discord.js";

/**
 * Discord client event type
 */
export type BotEvent = {
    name: Events;
    once: boolean,
    async execute(...args): Promise<void>;
};
