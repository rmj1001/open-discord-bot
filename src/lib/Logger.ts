import { TextChannel } from 'discord.js';
import * as path from 'path';
import * as fs from 'fs';
import { bot } from '../index';

export class Logger
{
    private logFilePath: string;

    private logDate: Date;

    private logFileName: string;

    constructor(logFolder: string)
    {
        this.logDate = new Date();

        const date = `${this.logDate.getFullYear()}-${this.logDate.getMonth()}-${this.logDate.getDay()}`;
        let hours = this.logDate.getHours();
        let am = "am";

        if (hours === 0)
        {
            hours = 12;
        }

        else if (hours > 12)
        {
            am = "pm";
            hours = hours - 12;
        }

        let time = `${hours}:${this.logDate.getMinutes()}:${this.logDate.getSeconds()}${am}`;

        this.logFileName =
            `${date} ${time}.log`;

        // TODO: For some reason bot.folders.logs and other properties are undefined
        this.logFilePath = path.join(logFolder, this.logFileName);
    }

    private async sendToConsole(text: string): Promise<void>
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

    private writeToLogFile(text: string | any)
    {
        fs.appendFileSync(this.logFilePath, `${text}\n`);
    }

    async log(text: string | any)
    {
        console.log(`[LOG] ${text}`);
        this.writeToLogFile(`[LOG] ${text}`);
        await this.sendToConsole(`\`\`\`md\n# LOG\n\n${text}\n\`\`\``);
    }

    async warn(text: string | any)
    {
        console.warn(`[WARNING] ${text}`);
        this.writeToLogFile(`[WARNING] ${text}`);
        await this.sendToConsole(`\`\`\`md\n< WARNING >\n\n${text}\n\`\`\``);
    }

    async error(text: string | any)
    {
        console.error(`[ERROR] ${text}`);
        this.writeToLogFile(`[ERROR] ${text}`);
        await this.sendToConsole(`\`\`\`md\n* ERROR *\n\n${text}\n\`\`\``);
    }
}
