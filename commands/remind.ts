import { CommandObject, CommandType } from "wokcommands";

export default {
     callback(commandUsage) {
        commandUsage.guild?.members.fetch(commandUsage.channel?.topic as string)
        .then(async(member) => {
            const channel = await member?.createDM()
            channel?.send({
                content:"Hey you may have new messages on your ticket. " + `<#${commandUsage.channel.id}>`
            }).catch(err => {if(err) {console.log(err)}})

            commandUsage.interaction.reply({
                content:"Reminder sent.",
                ephemeral:true
            })
        }).catch((err) => {
            if(err){
                commandUsage.interaction.reply({
                    content:"You do not have the permission to execute this command",
                    ephemeral:true
                })
            }
        })



    },
    testOnly:false,
    type:CommandType.SLASH,
    description:"Reminds a creator of a ticket",
    

} as CommandObject