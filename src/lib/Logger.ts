import { TextChannel } from 'discord.js';
import { bot } from '../index';

async function sendToConsole(text: string): Promise<void>
{
    try
    {
        if (bot.client.isReady())
        {
            await (bot.client.channels.cache.get
                ((bot.config.devGuild.consoleChannelId)) as TextChannel)
                .send(`${text}`);
        }
    } catch {
        // do nothing
    }
}

export let logger = {
    async log(text: string)
    {
        console.log(`LOG: ${text}`);
        await sendToConsole(`**LOG:**\n\`\`\`${text}\`\`\``);
    },
    async warn(text: string)
    {
        console.log(`WARN: ${text}`);
        await sendToConsole(`**WARN:**\n\`\`\`${text}\`\`\``);
    },
    async error(text: string)
    {
        console.log(`ERROR: ${text}`);
        await sendToConsole(`**ERROR:**\n\`\`\`${text}\`\`\``);
    }
};
