import { Events } from 'discord.js';
import { bot } from 'index';
import { BotEvent } from '@mytypes/BotEvent';

let event: BotEvent = {
    name: Events.ClientReady,
    once: true,
    async execute(client: any)
    {
        bot.logger.log(`${bot.config.botCodeName} v${bot.config.botVersionNumber} has started.`);
        bot.logger.log(`Logged in as ${client.user.tag}`);

        // Set activity and presence
        const status: any = `${bot.config.botStatus}`;
        const activities: any = bot.config.botActivityStrings;
        const activity: any = activities[Math.floor(Math.random() * activities.length)];

        bot.client.user?.setPresence({ activities: [{ name: activity }], status: status });
        bot.logger.log(`Set status to ${status}`);
        bot.logger.log(`Set activity to ${activity}`);
    },
};

module.exports = event;
