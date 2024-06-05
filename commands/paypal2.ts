import { EmbedBuilder } from "@discordjs/builders";
import { RGBTuple } from "discord.js";
import { CommandObject, CommandType } from "wokcommands";

export default {
    callback(commandUsage) {
        const embed = new EmbedBuilder()
        .setTitle("RED LV SPACE REVOLVER")
        .setFooter({
            iconURL:"https://cdn.discordapp.com/attachments/1140025838650265600/1196480873822965810/5_Optic_Logo.png?ex=65b7c8a5&is=65a553a5&hm=164da37d7a32c85aa9406ba8e9aace92374d04cfc5aa74da39a4057cd8dfb754&",
            text:"Password: 5optic."
        })
        .setDescription(`Mod made by 5OPTiC. / QUIN `)
        .setColor([0,162,255] as RGBTuple)

        
        commandUsage.interaction?.reply({
            embeds:[embed]
        })
    },
    testOnly:false,
    type:CommandType.SLASH,
    description:"Get the password for a File"

} as CommandObject