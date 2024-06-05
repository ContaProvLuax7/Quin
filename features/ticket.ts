import { ActionRowBuilder, TextInputBuilder } from "@discordjs/builders";
import {ButtonBuilder, ButtonStyle, Client, Colors, ComponentType, EmbedBuilder, GuildMember, ModalBuilder, RGBTuple, StringSelectMenuBuilder, StringSelectMenuInteraction, StringSelectMenuOptionBuilder, TextChannel, TextInputStyle } from "discord.js";
import WOK from "wokcommands";
import { TicketChannelsCategoryId,TicketChannelId,GuildId,VerifiedMeberRoleId,TicketFilesID } from '../config.json'
import fs from 'fs'
import path from "..";
import moment from 'moment'

const OrderModal = new ModalBuilder()
.setTitle("Ticket Creation")
.setCustomId("Ticket Modal")
.setComponents([
    new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
        .setLabel("What do u want to Buy?")
        .setCustomId("1")
        .setStyle(TextInputStyle.Short)
    ),
    new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
        .setLabel("Wich Paymentmethod do u want to use?")
        .setCustomId("2")
        .setStyle(TextInputStyle.Short),
    )
])

const applyModal = new ModalBuilder()
.setTitle("Ticket Creation")
.setCustomId("Ticket Modal")
.setComponents([
    new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
        .setLabel("What role are you applying for? ")
        .setCustomId("1")
        .setStyle(TextInputStyle.Short),
    )
])

const SupportModal = new ModalBuilder()
.setTitle("Ticket Creation")
.setCustomId("Ticket Modal")
.setComponents([
    new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
        .setLabel("What do u need help with?")
        .setCustomId("1")
        .setStyle(TextInputStyle.Short),
    )
])
const selectrow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    [
    new StringSelectMenuBuilder()
			.setCustomId('ticket')
			.setPlaceholder('Click here to create a ticket')
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('Create an Order')
					.setDescription('Create an item order')
					.setValue('Order')
                    .setEmoji("🎫"),
				new StringSelectMenuOptionBuilder()
					.setLabel('Apply for 5OPTiC.')
					.setDescription('Apply for our team')
					.setValue('Apply')
                    .setEmoji("🎫"),
				new StringSelectMenuOptionBuilder()
					.setLabel('Support')
					.setDescription('Get help to end your problems')
					.setValue('Support')
                    .setEmoji("🎫"),
                new StringSelectMenuOptionBuilder()
					.setLabel('Giveaway Claim')
					.setDescription('Claim the rewards for a giveaway')
					.setValue('Giveaway')
                    .setEmoji("🎫"),
            )
    ]
)
const rootEmbed = new EmbedBuilder()
.setTitle("Ticket")
.setDescription("You want to **buy** something from our store or you need **Support?** \n Then open a ticket selecting a Category. \n \n **Accepted payment methods:**\n PayPal <:paypal:1175283687340916756> \n PaySafe <:psc:1175283663366279289> \n Crypto (LTC, BTC) <:crypto:1175283630294188093> \n \n **Copyright** \n :flag_de: \n **Der Weiterverkauf, das Teilen mit Dritten und der Austausch unserer Artikel ist untersagt! ** \n :flag_us: \n **The resale, sharing with third parties and the exchange of our articles is prohibited!** \n \n **Durch den Kauf von Artikeln dieses Unternehmens erklärt der Kunde sein Einverständnis mit den Nutzungsbedingungen. / By purchasing items from this company, the customer agrees to the terms of use.**")
.setColor([0,162,255] as RGBTuple)

const RootActionRow = new ActionRowBuilder<ButtonBuilder>()
.setComponents(new ButtonBuilder()
.setLabel("Open a ticket")
.setStyle(ButtonStyle.Success)
.setCustomId("open ticket")
)

const QuestionMap = new Map<string,string[]>()
QuestionMap.set("Order",["Product","Method Of Payment"])
QuestionMap.set("Apply",["Apply role"])
QuestionMap.set("Support",["Issue"])

const CloseTicketActionRow = new ActionRowBuilder<ButtonBuilder>()
.addComponents(new ButtonBuilder()
.setLabel("Close Ticket")
.setStyle(ButtonStyle.Danger)
.setEmoji("💀")
.setCustomId("Close_ticket"))

const CloseTicketActionRowUnactive = new ActionRowBuilder<ButtonBuilder>()
.addComponents(new ButtonBuilder()
.setLabel("Close Ticket")
.setStyle(ButtonStyle.Danger)
.setEmoji("💀")
.setCustomId("non-active")
.setDisabled(true))


const TicketCloseModal = new ModalBuilder()
.setCustomId("close_modal")
.setTitle("Modal closing")
.setComponents([
    new ActionRowBuilder<TextInputBuilder>()
    .addComponents(new TextInputBuilder()
    .setLabel("Reason")
    .setCustomId("rr")
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder("Not especified"))
])



export default async (instance: WOK, client: Client) => {
    const guild = await client.guilds.fetch(GuildId)
    const tktChannel = await guild.channels.fetch(TicketChannelId) as TextChannel

    const Cumessage = await tktChannel.send({
        embeds:[rootEmbed],
        components:[selectrow]
    });
    const collector = await Cumessage.createMessageComponentCollector({
        max:100000000000,
        componentType:ComponentType.StringSelect
    })
    
    collector.on('collect', async(interaction) => {

        let Modal : Promise<void>;

        switch (interaction.values[0])
        {
            
            case 'Apply':

                Modal = interaction.showModal(applyModal)
            break
            case 'Support':

                Modal = interaction.showModal(SupportModal)
            break
            case 'Giveaway':
                //Giveaway claim interaction
                Modal = undefined;
                const channel = await guild.channels.create({
                    parent:TicketChannelsCategoryId,
                    name:`Giveaway-${interaction.member.displayName}`,
                })

                channel.permissionOverwrites.create(interaction.member,{
                    ViewChannel:true
                })
                channel.permissionOverwrites.create(guild.roles.everyone,{
                    ViewChannel:false
                })
    
    
                const embed = new EmbedBuilder()
                .setTitle("Ticket")
                .addFields({
                    name:"Type",
                    value:interaction.values[0]
                })
                .setAuthor({
                    iconURL:interaction.member.displayAvatarURL({size:512}),
                    name:interaction.member.displayName
                });
                channel.send({
                    embeds:[embed],
                    components:[CloseTicketActionRow]
                })
                interaction.reply({
                    content:`Ticket created at <#${channel.id}>`,
                    ephemeral:true
                })
                channel.setTopic(interaction.member.id)
        break

        case 'Order':
            Modal = interaction.showModal(OrderModal)
        break
        }
        if(Modal)
        {
            interaction.awaitModalSubmit({
                time:10*60*1000
            }).then(async(submit) => {
                const channel = await guild.channels.create({
                    parent:TicketChannelsCategoryId,
                    name:`Ticket-${interaction.member.displayName}`,
                })
    
                channel.permissionOverwrites.create(interaction.member.user,{
                    ViewChannel:true
                });
                channel.permissionOverwrites.create(guild.roles.everyone,{
                    ViewChannel:false
                });
                channel.permissionOverwrites.create(VerifiedMeberRoleId,{
                    ViewChannel:false
                });

                const TicketVisbleRoles = JSON.parse(require('../TicketVisibleRoles.json')) as string[]
                for(const roleId of TicketVisbleRoles)
                {
                    channel.permissionOverwrites.create(roleId,{
                        ViewChannel:true
                    })
                }

                channel.setTopic(interaction.member.id)
    
    
                const embed = new EmbedBuilder()
                .setTitle("Ticket")
                .addFields({
                    name:"Type",
                    value:interaction.values[0],
                    inline:false
                })
                .setAuthor({
                    iconURL:interaction.member.displayAvatarURL({size:512}),
                    name:interaction.member.displayName
                });
                let Iteration = 0;
                submit.fields.fields.forEach(element => {
                    embed.addFields([
                        {
                            name:QuestionMap.get(interaction.values[0])[Iteration],
                            value:element.value,
                            inline:true
                        }
                    ])
                    Iteration++
                })
                
                const msg = await channel.send({
                    embeds:[embed],
                    components:[CloseTicketActionRow]
                })
                submit.reply({
                    content:`Ticket created at <#${channel.id}>`,
                    ephemeral:true
                })
            }).catch((err) => {
                console.error(`Error creating ticket:\n ${err}`);

                return
            })
        }

    })    

    client.on('interactionCreate', (interaction) => {

        if(interaction.isButton()){
            if(interaction.customId !== "Close_ticket"){
                return
            }
           

            interaction.message.edit({
                components:[
                    CloseTicketActionRowUnactive
                ]
            })
    
            interaction.showModal(TicketCloseModal)
            interaction.awaitModalSubmit({
                time:3 * 1000 * 60,
                dispose:true
            }).then(async(submit) => {
                
                const member = submit.member as GuildMember
                const channel = submit.channel as TextChannel
    
                if(member.id !== channel.topic){
                        (await guild.members.fetch(channel.topic)).send("Your ticket was closed. Reason : " + submit.fields.fields.at(0).value)
                }
                
    
                //Saves the ticket as text file
                    const TicketKey = KeyGen(10) + "-" + member.displayName
                    const stream = fs.createWriteStream(`${path}/ticketText/${TicketKey}.txt`)
                    const AllMessages = (await channel.messages.fetch()).map((message) => {return message}).reverse()
    
                    stream.write(`Ticket of ${member.displayName} \n`)
    
                        AllMessages.forEach((value) => {
                            stream.write(`[${moment(value.createdTimestamp).format("MMMM Do, h:mm:ss a")}]  ${value.member.displayName} \n`)
                        })
    
                        
                        stream.write(`\n \n Ticket closed, reason: ${submit.fields.fields.at(0).value}`)
                        stream.write(`\n Ticket closed at : ${moment().format("MMMM Do, h:mm:ss a")}`)
                        stream.write(`\n Ticket closed by ${(submit.member as GuildMember).displayName} `)
                    
                    stream.close()
                    channel.delete(submit.fields.fields.at(0).value)
    
                    const TicketFileChannel = (await guild.channels.fetch(TicketFilesID)) as TextChannel
    
                    TicketFileChannel.send({
                        files:[`${path}/ticketText/${TicketKey}.txt`]
                    })

                    submit.deferReply()
                return
            }).catch((err) => {
                if(err){
                    console.log(err)
                }
                if(err.code === "InteractionCollectorError"){
                    interaction.message.edit({
                    components:[
                        CloseTicketActionRow
                    ]
                    })
                }
            })
    
            
            return
        }
        
    })
}

function KeyGen(len : number) : string{
    const chars = "abcdefghijklmopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUV"
    const key : string[] = []

    for(let i = 0;i<len;i++){
        key.push(chars[Math.round(Math.random() * chars.length)])
    }

    return key.join('')
}