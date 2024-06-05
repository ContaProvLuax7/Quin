import discord, { Guild, TextChannel } from 'discord.js'
import wokcommands from 'wokcommands'
import {GuildId,TicketChannelId,GuildVerifyChannel,BotToken} from './config.json'
const path = __dirname
export default path

const client = new discord.Client({
    intents:["Guilds","GuildMembers"]
})

client.once("ready", async() => {
    console.log("Bot ready for deploy")

    const guild = await client.guilds.fetch(GuildId) as Guild
    const tktChannel = await guild.channels.fetch(TicketChannelId) as TextChannel
    const VerifyChannel = await guild.channels.fetch(GuildVerifyChannel) as TextChannel

await tktChannel.bulkDelete(99)
VerifyChannel.bulkDelete(99).then(() => {
    const WOK = new wokcommands({
        client:client,
        featuresDir: __dirname + "/features",
        commandsDir:__dirname+"/commands"
    })
})

})


client.login(BotToken)