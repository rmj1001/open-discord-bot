import { TextChannel } from 'discord.js';
import { bot } from 'index';

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
    async log(text: string | any)
    {
        console.log(`LOG: ${text}`);
        await sendToConsole(`\`\`\`md\n# LOG\n\n${text}\n\`\`\``);
    },
    async warn(text: string | any)
    {
        console.log(`WARNING: ${text}`);
        await sendToConsole(`\`\`\`md\n< WARNING >\n\n${text}\n\`\`\``);
    },
    async error(text: string | any)
    {
        console.log(`ERROR: ${text}`);
        await sendToConsole(`\`\`\`md\n* ERROR *\n\n${text}\n\`\`\``);
    }
};
