import { Events } from 'discord.js';

module.exports = {
    name: Events.ClientReady,
    // Stops listening after this event is called once.
    once: false,
    execute(client: any)
    {
        // code here
    },
};