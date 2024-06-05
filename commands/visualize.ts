import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Guild, GuildMember,ButtonStyle, ComponentType, ApplicationCommandOptionType} from "discord.js";
import { CommandObject, CommandType} from "wokcommands";
import moment from "moment";
import async from '../features/delete';
import discord from 'discord.js';


export default {
    async callback(commandUsage) {

        const member = commandUsage.interaction.options.getMember("member") as GuildMember; 



        const embed = new EmbedBuilder()
        .addFields([
            {
                name:"Name",
                value:`${member.user.tag}`,
                inline:true
            }, 
            {
                name:"Joined At",
                value:`${moment(member.joinedAt).format("DD/MM/YYYY HH:MM")}`,
                inline:true
            }
        ])
        .setAuthor({
            name:member.displayName,
            iconURL:member.displayAvatarURL({size:64})
        })
        .setFooter({
            text:moment().format("DD/MM/YYYY hh:mm")
        })

        const ActionRow = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
            new ButtonBuilder()
            .setCustomId("kick")
            .setLabel("Kick")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("ban")
            .setLabel("ban")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId('timeOut')
            .setLabel("TimeOut")
            .setStyle(ButtonStyle.Secondary)
        ])

        commandUsage.interaction.reply({
            embeds:[embed],
            components:member.permissions.has('Administrator') ? [ActionRow] : [], 
            ephemeral:true
        }).then((message) => {
            message.awaitMessageComponent(({
                componentType:ComponentType.Button,
                time:10 * 1000 * 60
            })).then((colect) => {
                message.edit({
                    embeds:[embed],
                    components:[],
                })
                
                try{
                    switch(colect.customId)
                    {
                        case ("kick"):
                            member.kick(`Member kicked by operator: ${commandUsage.member.displayName}`)
                            colect.reply({
                                content:"Member kicked",
                                ephemeral:true
                            })
                            .catch((err) => {
                                if(err){
                                    console.log(err.message)
                                }
                            })
                        break
                        case ("ban"):
                            member.ban({
                                reason:`Member banned by operator : ${commandUsage.member.displayName}`
                            })
                            .catch((err) => {
                                if(err){
                                    console.log(err.message)
                                }
                            })
                            colect.reply({
                                content:"Member banned",
                                ephemeral:true
                            })
                        break
                        case ("timeOut"):
                            member.timeout(10,`Member time outed by operator : ${commandUsage.member.displayName}`)
                            .catch((err) => {
                                if(err){
                                    console.log(err.message)
                                }
                            })
                            colect.reply({
                                content:"Member time outed",
                                ephemeral:true
                            })
                        break
                    }
                }
                catch(error){
                    if(error){
                        console.log(error)
                    }
                }

            })
        })
    },
    testOnly:false,
    type:CommandType.SLASH,
    description:"Visualize a member of the server",
    aliases:['view'],
    options:[{
        name:"member",
        description:"The member to visualize",
        required:true,
        type:ApplicationCommandOptionType.User
    }],
} as CommandObject