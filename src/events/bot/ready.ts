import { Events } from 'discord.js';
import { bot } from '../../index';
import { BotEvent } from '../../types/BotEvent';

let event: BotEvent = {
    name: Events.ClientReady,
    once: true,
    async execute(client: any)
    {
        console.log(`${bot.config.botCodeName} v${bot.config.botVersionNumber} has started.`);
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};

module.exports = event;
