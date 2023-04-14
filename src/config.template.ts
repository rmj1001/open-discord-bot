// ------------------------------------------------
//   Author(s): RMCJ < rmichael1001@gmail.com>
//   Project: OpenDiscordBot
//   Version: 1.0
//
//   Description: Config file template
//
//   Instructions: Rename file to 'config.ts' and fill
//                 out the values below.
//
// ------------------------------------------------


export interface ConfigType
{
    token: string,
    invite?: string,
    project: string,
    version: number,
    clientId: string,
    guildId: string;
}

export let config: ConfigType = {
    token: "",
    invite: "",
    project: "",
    version: 0,
    clientId: "",
    guildId: ""
};