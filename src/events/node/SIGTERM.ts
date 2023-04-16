import { bot } from 'index';
import { NodeEvent } from "@mytypes/NodeEvent";

let event: NodeEvent = {
    name: 'SIGTERM',
    once: false,
    execute()
    {
        bot.shutdown();
    },
};

module.exports = event;
