// ------------------------------------------------
//   Author(s): RMCJ < rmichael1001@gmail.com>
//   Project: OpenDiscordBot
//   Version: 1.0
//
//   Command: command
//   Usage: /command argument:type
//   Description: n/a
//
// ------------------------------------------------

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { SlashCommandType } from '../../../types/SlashCommand';
import { bot } from '../../../index';

let slashCommand: SlashCommandType = {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Evaluate string as typescript code')
        .addStringOption(code => (
            code
                .setName('code')
                .setDescription('The code to evaluate')
        )),
    ownerOnly: true,
    async execute(interaction: ChatInputCommandInteraction)
    {
        let code = interaction.options.getString('code');

        if (!code)
        {
            await interaction.reply(`You need to input code!`);
            return;
        }

        // This function cleans up and prepares the
        // result of our eval command input for sending
        // to the channel
        const clean = async (text: string) =>
        {
            // If our input is a promise, await it before continuing
            if (text && text.constructor.name == "Promise")
                text = await text;

            // If the response isn't a string, `util.inspect()`
            // is used to 'stringify' the code in a safe way that
            // won't error out on objects with circular references
            // (like Collections, for example)
            if (typeof text !== "string")
                text = require("util").inspect(text, { depth: 1 });

            // Replace symbols with character code alternatives
            text = text
                .replace(/`/g, "`" + String.fromCharCode(8203))
                .replace(/@/g, "@" + String.fromCharCode(8203));

            // Send off the cleaned up result
            return text;
        };

        function evalText(type: "EVAL" | "ERROR", text: any): string
        {
            return `\`\`\`md\n# ${type}\n\n${text}\n\`\`\``;
        }

        // In case something fails, we to catch errors
        // in a try/catch block
        try
        {
            // Evaluate (execute) our input
            const evaled = eval(code);

            // Put our eval result through the function
            // we defined above
            const cleaned = await clean(evaled);

            // Reply in the channel with our result
            await interaction.reply(evalText("EVAL", cleaned));
        } catch (err: any)
        {
            // Reply in the channel with our error
            await interaction.reply(evalText("ERROR", clean(err)));
        }
    },
};

module.exports = slashCommand;
