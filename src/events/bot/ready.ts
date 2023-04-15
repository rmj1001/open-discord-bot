import { Events } from 'discord.js';
import { bot } from '../../index';
import { BotEvent } from '../../types/BotEvent';

let event: BotEvent = {
    name: Events.ClientReady,
    once: true,
    async execute(client: any)
    {
        bot.logger.log(`${bot.config.botCodeName} v${bot.config.botVersionNumber} has started.`);
        bot.logger.log(`Logged in as ${client.user.tag}`);
    },
};

module.exports = event;
