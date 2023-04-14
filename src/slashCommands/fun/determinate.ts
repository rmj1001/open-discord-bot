// ------------------------------------------------
//   Author(s): RMCJ < rmichael1001@gmail.com>
//   Project: OpenDiscordBot
//   Version: 1.0
//
//   Command: determinate
//   Usage: /determinate
//   Description: GOTTA TURN THE WORLD INTO YOUR DANCE FLOOR
//
// ------------------------------------------------

import { SlashCommandBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('determinate')
        .setDescription('GOTTA TURN THE WORLD INTO YOUR DANCE FLOOR'),
    async execute(interaction: any)
    {
        let lyrics: string[] = [];
        lyrics[0] = `
Trying hard to fight these tears
I'm crazy worried
Messing with my head this fear
I'm so sorry
You know you gotta get it out
I can't take it
That's what being friends is about
I, I want to cry
I can't deny
Tonight I wanna up and hide
And get inside
It isn't right
I gotta live in my life
I know I, I know I
I know I gotta do it
I know I, I know I
I know I gotta do it
Gotta turn the world into your dance floor
Determinate, determinate
Push until you can't and then demand more
Determinate, determinate
You and me together, we can make it better
Gotta turn the world into your dance floor
Determinate, determinate
Hate to feel this way
And waste a day
I gotta get myself on stage
I shouldn't wait or be afraid
The chips will fall where they may
I know I, I know I
I know I gotta do it
I know I, I know I
I know I gotta do it
Gotta turn the world into your dance floor
Determinate, determinate
Push until you can't and then demand more
Determinate, determinate
You and me together, we can make it better
Gotta turn the world into your dance floor
Determinate, determinate
It's Wen and I'm heaven-sent
Use it like a veteran
Renegade, lemonade, music is my medicine
Go ahead and try to name a band we ain't better than
Reason why the whole world's picking us instead of them
People need a breather cause they're feeling the adrenaline
Stop! Now hurry up and let us in. Knock!
Cause we're coming to your house (and)
People keep on smiling with lemons in their mouth
I'm the real deal, you know how I feel
Why they in it for the mil I'm just in it for the thrill
Get down now I ain't playin' around put your feet up from the ground
And just make that sound what
Gotta turn the world into your dance floor
Determinate, determinate
Push until you can't and then demand more
Determinate, determinate
You and me together, we can make it better
Gotta turn the world into your dance floor
Determinate, determinate
Come on and, come on and
Come on and get it going
Come on and, come on and`;

        for (let i = 0; i < lyrics.length; i++)
        {
            await interaction.reply(lyrics[i]);
        }
    },
};
