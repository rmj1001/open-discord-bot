import { bot } from '../../index';

module.exports = {
    name: 'SIGINT',
    once: true,
    execute()
    {
        bot.shutdown();
    },
};