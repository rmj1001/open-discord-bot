import { Events } from 'discord.js';
import { bot } from '../../index';

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client: any)
    {
        console.log(`${bot.config.project} v${bot.config.version} has started.`);
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};