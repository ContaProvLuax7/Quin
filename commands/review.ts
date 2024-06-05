import { ActionRowBuilder, EmbedBuilder, GuildMember, ModalBuilder, RGBTuple, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js";
import { CommandObject, CommandType } from "wokcommands";
import {GuildId,GuildReviewChannel} from "../config.json"

const product_name = new TextInputBuilder()
.setCustomId('productname_input')
.setLabel("Product name")
.setStyle(TextInputStyle.Short)
.setMaxLength(100)

const service_rating = new TextInputBuilder()
.setCustomId('servicerating_input')
.setLabel("Service Rating ( 1 to 5)")
.setStyle(TextInputStyle.Short)
.setMaxLength(1)

const product_satisfaction = new TextInputBuilder()
.setCustomId('satisfaction_input')
.setLabel("Product Satisfaction ( 1 to 5 )")
.setStyle(TextInputStyle.Short)
.setMaxLength(100)

const product_recommendation = new TextInputBuilder()
.setCustomId('productrecomendation_input')
.setLabel("Product recomendation ( 1 to 5 )")
.setStyle(TextInputStyle.Short)
.setMaxLength(1)

const product_comments = new TextInputBuilder()
.setCustomId('productcomments_input')
.setLabel("product comments")
.setStyle(TextInputStyle.Paragraph)

const rows = [
    new ActionRowBuilder<TextInputBuilder>().addComponents(product_name),
    new ActionRowBuilder<TextInputBuilder>().addComponents(service_rating),
    new ActionRowBuilder<TextInputBuilder>().addComponents(product_satisfaction),
    new ActionRowBuilder<TextInputBuilder>().addComponents(product_recommendation),
    new ActionRowBuilder<TextInputBuilder>().addComponents(product_comments)
]

const modal = new ModalBuilder()
.setCustomId("review_modal")
.addComponents()
.setTitle("Review information")
.addComponents(...rows)

const p = parseInt

export default {

    async callback(commandUsage) {
        const { interaction } = commandUsage
        const member = commandUsage.member as GuildMember
        const channel = await (await commandUsage.client.guilds.fetch(GuildId)).channels.fetch(GuildReviewChannel) as TextChannel
    
        
        interaction.showModal(modal)
        interaction.awaitModalSubmit({
            time:1000*60*10,
            filter:(i) => {return interaction.member === i.member}
        }).then(async(value) => {

           if(!value.deferred)
                {
                    const f = value.fields.fields

                    const rating = parseInt(f.at(1).value)
                    const satisfaction = parseInt(f.at(2).value)
                    const recomendantion = parseInt(f.at(3).value)
                    
                    const embed = new EmbedBuilder()
                        .setAuthor({
                            name:`${interaction.member.user.username}'s review`,
                        })
                        .setThumbnail(member.user.avatarURL())
                        .addFields([
                            {
                                name:"Service Rating",
                                value:returnStar(Math.min(Math.max(rating,1),5)),
                                inline:false
                            },
                            {
                                name:"Product Satisfaction",
                                value:returnStar(Math.min(Math.max(satisfaction,1),5)),
                                inline:false
                            },
                            {
                                name:"Product Recomendation",
                                value:returnStar(Math.min(Math.max(recomendantion,1),5)),
                                inline:false
                            },
                            {
                                name:"Overall satisfaction",
                                value:returnStar(Math.min(Math.max((recomendantion + satisfaction + rating) / 3,1),5))
                            },
                            {
                                name:"Comments",
                                value:f.at(4).value
                            }
                        ])
                        .setImage("https://cdn.discordapp.com/attachments/1140025838650265600/1208276588555272242/REVIEW2-ezgif.com-video-to-gif-converter.gif?ex=66079c43&is=65f52743&hm=453f632b38329b35f9f976431c2a39df75d8973f65d313ea3dd7ff4d030688d0&")
                        .setTitle(f.at(0).value)
                        .setColor([0,162,255] as RGBTuple);
        
                       
                            channel.send({
                                embeds:[embed]
                            })
        
                            value.reply({
                                ephemeral:true,
                                content:"Thanks for the review."
                            })
                }
                

        }).catch((err) => {
            if(err){
                console.error(err.message)
                return
            }
        }) 
    },
    testOnly:false,
    description:"Create a review for a product",
    type:CommandType.SLASH,

} as CommandObject

function returnStar(n:number)
{
    let cu = ""
    for(var i = 0; i< n ; i++)
    {
        cu += "⭐"
    }

    return cu
}