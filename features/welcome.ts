import { Client, RGBTuple, TextChannel } from "discord.js";
import WOK from "wokcommands";
import {GuildJoinChannel,GuildVerifyChannel,GuildId} from '../config.json'
import { EmbedBuilder } from "@discordjs/builders";

export default async (instance: WOK, client: Client) => {
    
    (await client.guilds.fetch(GuildId)).channels.fetch(GuildJoinChannel)
    .then((channel : TextChannel) => {
        client.on('guildMemberAdd', (member) => {

            const embed = new EmbedBuilder()
            .setTitle(`Welcome to 5 Optic!`)
            .setAuthor({
                name:member.user.username,
                iconURL:member.user.avatarURL({
                    size:512
                }) || "https://cdn.pixabay.com/photo/2021/11/29/14/46/discord-6832787_960_720.png"
            })
            .setImage(member.user.avatarURL() || "https://cdn.pixabay.com/photo/2021/11/29/14/46/discord-6832787_960_720.png")
            .setDescription(`Welcome to 5OPTiC. start your excperience by verify you in <#${GuildVerifyChannel}>. \n Thank you for beeing here. `)
            .setColor([0,162,255] as RGBTuple)

            channel.send({
                embeds:[embed]
            })
            return
        })


    })

  };