import { bot } from '../../index';
import { NodeEvent } from "../../types/NodeEvent";

let event: NodeEvent = {
    name: 'SIGINT',
    once: false,
    execute()
    {
        bot.shutdown();
    },
};

module.exports = event;
