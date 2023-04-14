import { bot } from '../../index'

module.exports = {
    name: 'SIGTERM',
    once: true,
    execute() {
        bot.shutdown();
    },
};