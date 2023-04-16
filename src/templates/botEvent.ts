import { Events } from 'discord.js';
import { BotEvent } from '@mytypes/BotEvent';

let event: BotEvent = {
    name: Events.ClientReady,
    once: false,
    async execute(client: any)
    {
        // code here
    }
};

module.exports = event;
