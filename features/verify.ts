import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Colors, ComponentType, EmbedBuilder, RGBTuple, TextChannel } from "discord.js";
import WOK from "wokcommands";
import {VerifiedMeberRoleId, GuildId, GuildVerifyChannel} from '../config.json'

const button = new ButtonBuilder()
.setCustomId("verifyButton")
.setLabel("Verify")
.setStyle(ButtonStyle.Success);

const row = new ActionRowBuilder<ButtonBuilder>()
.addComponents([button])

const RootActionRow = new ActionRowBuilder<ButtonBuilder>()
.setComponents(new ButtonBuilder()
.setLabel("Verify")
.setStyle(ButtonStyle.Success)
.setCustomId("Verify")
)

const rootEmbed = new EmbedBuilder()
.setTitle("Verify")
.setDescription("Welcome to 5 OPTiC. \n Press the verify button to start your 5 OPTiC experience.")
.setImage("https://cdn.discordapp.com/attachments/1140025838650265600/1208264013272715356/Render-ezgif.com-video-to-gif-converter.gif?ex=65e2a68d&is=65d0318d&hm=31cb0a8323cb7b2ba40e2fafc987d999c1f2669ab74489d42cf3ee12f7c8b6d6&")
.setColor([0,162,255] as RGBTuple)



export default async (instance: WOK, client: Client) => {
    const guild = await client.guilds.fetch(GuildId)
    const tktChannel = await guild.channels.fetch(GuildVerifyChannel) as TextChannel

    rootEmbed
    .setAuthor({
        iconURL:guild.members.me.displayAvatarURL({size:512}),
         name:"5 OPTiC"
    })
    .setFooter({
        text:"5 OPTiC by QUIN"
    })

    try {
        const RootMessages = await tktChannel.send({
            embeds:[rootEmbed],
            components:[RootActionRow]
        });
    
        RootMessages.createMessageComponentCollector({
            max:1000000000000000,
        }).on('collect', (interaction) => {
            interaction.member.roles.add(VerifiedMeberRoleId)
            .catch((err) => {
                if(err){
                    console.log(`Error while adding role to ${interaction.user.username}\n`)
                    return
                }
            })
    
            interaction.reply({
                content:"You are now verified!",
                ephemeral:true
            })
    
            return
        })
    }
    catch (err){
        if(err)
        {
            console.log(err.message)
            return 

        }
    }


    
}