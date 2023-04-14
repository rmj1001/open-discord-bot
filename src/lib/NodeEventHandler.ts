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

/** Class for handling discord events 
 * 
 * @arg {string} rootPath
 * @arg {Client} client
*/
export class NodeEventHandler
{
    /** Path string for project root folder */
    root: string;

    /** Path string for events folder in project */
    eventsPath: string;

    /** Array of path strings for event files */
    eventFiles: string[];

    constructor(rootPath: string)
    {
        this.root = rootPath;
        this.eventsPath = path.join(this.root, 'events', 'node');
        this.eventFiles = fs.readdirSync(this.eventsPath).filter(file => file.endsWith('.ts'));
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
                process.once(event.name, (...args) => event.execute(...args));
            } else
            {
                process.once(event.name, (...args) => event.execute(...args));
            }
        }
    }
}
