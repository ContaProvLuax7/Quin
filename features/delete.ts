import {Client, TextChannel} from 'discord.js'
import WOK from 'wokcommands'
import {TicketChannelId,GuildId ,GuildVerifyChannel} from '../config.json'


export default async (instance: WOK, client: Client) => {

    client.on('ready', async() => {

        const guild = await client.guilds.fetch(GuildId)
        const tktChannel = await guild.channels.fetch(TicketChannelId) as TextChannel
        const VerifyChannel = await guild.channels.fetch(GuildVerifyChannel) as TextChannel

  tktChannel.bulkDelete(99)
  VerifyChannel.bulkDelete(99)
        
        
    })

}