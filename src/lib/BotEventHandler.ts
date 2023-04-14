// ------------------------------------------------
//   Author(s): RMCJ < rmichael1001@gmail.com>
//   Project: OpenDiscordBot
//   Version: 1.0
//
//   Description: Event Handling API
//
// ------------------------------------------------

import * as path from 'path';
import * as fs from 'fs';
import { Client } from 'discord.js';

/** Class for handling discord events 
 * 
 * @arg {string} rootPath
 * @arg {Client} client
*/
export class BotEventHandler
{
    /** Path string for project root folder */
    root: string;

    /** Path string for events folder in project */
    eventsPath: string;

    /** Array of path strings for event files */
    eventFiles: string[];

    /** Discord client */
    client: Client;

    constructor(rootPath: string, client: Client)
    {
        this.root = rootPath;
        this.eventsPath = path.join(this.root, 'events', 'bot');
        this.eventFiles = fs.readdirSync(this.eventsPath).filter(file => file.endsWith('.ts'));
        this.client = client;
    }

    /**
     * Load all event files into memory and run event if event triggers
     * 
     * @returns {void}
     */
    loadEvents(): void
    {
        for (const file of this.eventFiles)
        {
            const filePath = path.join(this.eventsPath, file);
            const event = require(filePath);
            if (event.once)
            {
                this.client.once(event.name, (...args) => event.execute(...args));
            } else
            {
                this.client.on(event.name, (...args) => event.execute(...args));
            }
        }
    }
}