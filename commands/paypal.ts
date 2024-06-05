import { EmbedBuilder } from "@discordjs/builders";
import { RGBTuple } from "discord.js";
import { CommandObject, CommandType } from "wokcommands";

export default {
    callback(commandUsage) {
        const embed = new EmbedBuilder()
        .setTitle("Pay with paypal")
        .setThumbnail("https://cdn.discordapp.com/attachments/1140025838650265600/1196480873822965810/5_Optic_Logo.png?ex=65b7c8a5&is=65a553a5&hm=164da37d7a32c85aa9406ba8e9aace92374d04cfc5aa74da39a4057cd8dfb754&")
        .setFooter({
            iconURL:"https://cdn.discordapp.com/attachments/1140025838650265600/1196480873822965810/5_Optic_Logo.png?ex=65b7c8a5&is=65a553a5&hm=164da37d7a32c85aa9406ba8e9aace92374d04cfc5aa74da39a4057cd8dfb754&",
            text:"Don't forget to send a screenshot after the payment"
        })
        .setDescription(`Make sure to send the Money to F&F ( Family and Friends) \n \n -No Notes \n **PayPal**: https://paypal.me/MarcelBiryukov `)
        .setColor([0,162,255] as RGBTuple)

        
        commandUsage.interaction?.reply({
            embeds:[embed]
        })
    },
    testOnly:false,
    type:CommandType.SLASH,
    description:"Gets the link to the server's paypal"

} as CommandObject