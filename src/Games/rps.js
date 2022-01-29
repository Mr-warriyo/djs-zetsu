const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")

async function rps(interaction, options) {
  let opponent = interaction.options.getMember("opponent")
  if (!opponent) return interaction.followUp("No opponent mentioned!")
  if (opponent.id == interaction.user.id)
    return interaction.followUp("You cannot play by yourself!")

  foot = "Rock Paper Scissors"

  let acceptEmbed = new MessageEmbed()
    .setTitle(`Waiting for ${opponent.user.tag} to accept!`)
    .setAuthor({
      name: interaction.user.tag,
      url: interaction.user.avatarURL({ dynamic: true }),
    })
    .setColor("RANDOM")
    .setFooter({ text: "Rock Paper Scissors" })

  let accep = new MessageActionRow().addComponents(
    new MessageButton()
      .setLabel("Accept")
      .setStyle("SUCCESS")
      .setCustomId("accept"),
    new MessageButton()
      .setLabel("Decline")
      .setStyle("DANGER")
      .setCustomId("decline")
  )

  interaction
    .followUp({
      embeds: [acceptEmbed],
      components: [accep],
    })
    .then((m) => {
      let filter = (button) => button.user.id == opponent.id
      const collector = m.createMessageComponentCollector({
        type: "BUTTON",
        time: 30000,
        filter: filter,
      })
      collector.on("collect", (button) => {
        if (button.customId == "decline") {
          button.deferUpdate()
          return collector.stop("decline")
        }
        button.deferUpdate()
        let embed = new MessageEmbed()
          .setTitle(`${interaction.user.tag} VS. ${opponent.user.tag}`)
          .setColor("RANDOM")
          .setFooter({ text: "RPS" })
          .setDescription("Select 🗻, 📄, or ✂️")

        if (options.rockColor === "grey") {
          options.rockColor = "SECONDARY"
        } else if (options.rockColor === "red") {
          options.rockColor = "DANGER"
        } else if (options.rockColor === "green") {
          options.rockColor = "SUCCESS"
        } else if (options.rockColor === "blurple") {
          options.rockColor = "PRIMARY"
        }

        let row = new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel("ROCK")
            .setCustomId("rock")
            .setStyle("PRIMARY")
            .setEmoji("🗻"),

          new MessageButton()
            .setLabel("PAPER")
            .setCustomId("paper")
            .setStyle("SECONDARY")
            .setEmoji("📄"),

          new MessageButton()
            .setLabel("SCISSORS")
            .setCustomId("scissors")
            .setStyle("DANGER")
            .setEmoji("✂️")
        )

        m.edit({
          embeds: [embed],
          components: [row],
        })

        collector.stop()
        let ids = new Set()
        ids.add(interaction.user.id)
        ids.add(opponent.id)
        let op, auth
        let filter = (button) => ids.has(button.user.id)
        const collect = m.createMessageComponentCollector({
          filter: filter,
          type: "BUTTON",
          time: 30000,
        })
        collect.on("collect", (b) => {
          ids.delete(b.user.id)
          b.deferUpdate()
          if (b.user.id == opponent.id) {
            mem = b.customId
          }
          if (b.user.id == interaction.user.id) {
            auth = b.customId
          }
          if (ids.size == 0) collect.stop()
        })
        collect.on("end", (c, reason) => {
          if (reason == "time") {
            let embed = new MessageEmbed()
              .setTitle("Game Timed Out!")
              .setColor("RED")
              .setDescription(
                "One or more players did not make a move in time(30s)"
              )
              .setFooter({ text: "RPS" })
            m.edit({
              embeds: [embed],
              components: [],
            })
          } else {
            if (mem == "rock" && auth == "scissors") {
              let embed = new MessageEmbed()
                .setTitle(`${opponent.user.tag} Wins!`)
                .setColor("GREEN")
                .setDescription("Rock defeats Scissors")
                .setFooter({ text: "RPS" })
              m.edit({ embeds: [embed], components: [] })
            } else if (mem == "scissors" && auth == "rock") {
              let embed = new MessageEmbed()
                .setTitle(`${interaction.member.user.tag} Wins!`)
                .setColor("GREEN")
                .setDescription("Rock defeats Scissors")
                .setFooter({ text: "RPS" })
              m.edit({ embeds: [embed], components: [] })
            } else if (mem == "scissors" && auth == "paper") {
              let embed = new MessageEmbed()
                .setTitle(`${opponent.user.tag} Wins!`)
                .setColor("GREEN")
                .setDescription("Scissors defeats Paper")
                .setFooter({ text: "RPS" })
              m.edit({ embeds: [embed], components: [] })
            } else if (mem == "paper" && auth == "scissors") {
              let embed = new MessageEmbed()
                .setTitle(`${interaction.member.user.tag} Wins!`)
                .setColor("GREEN")
                .setDescription("Scissors defeats Paper")
                .setFooter({ text: "RPS" })
              m.edit({ embeds: [embed], components: [] })
            } else if (mem == "paper" && auth == "rock") {
              let embed = new MessageEmbed()
                .setTitle(`${opponent.user.tag} Wins!`)
                .setColor("GREEN")
                .setDescription("Paper defeats Rock")
                .setFooter({ text: "RPS" })
              m.edit({ embeds: [embed], components: [] })
            } else if (mem == "rock" && auth == "paper") {
              let embed = new MessageEmbed()
                .setTitle(`${interaction.member.user.tag} Wins!`)
                .setColor("GREEN")
                .setDescription("Paper defeats Rock")
                .setFooter({ text: "RPS" })
              m.edit({ embeds: [embed], components: [] })
            } else {
              let embed = new MessageEmbed()
                .setTitle("Draw!")
                .setColor("GREEN")
                .setDescription(`Both players chose ${mem}`)
                .setFooter({ text: "RPS" })
              m.edit({ embeds: [embed], components: [] })
            }
          }
        })
      })
      collector.on("end", (collected, reason) => {
        if (reason == "time") {
          let embed = new MessageEmbed()
            .setTitle("Challenge Not Accepted in Time")
            .setAuthor({
              name: interaction.user.tag,
              url: interaction.user.avatarURL({ dynamic: true }),
            })
            .setColor("RED")
            .setFooter({ text: "RPS" })
            .setDescription("Ran out of time!\nTime limit: 30s")
          m.edit({
            embeds: [embed],
            components: [],
          })
        }
        if (reason == "decline") {
          let embed = new MessageEmbed()
            .setTitle("Game Declined!")
            .setAuthor({
              name: interaction.user.tag,
              url: interaction.user.avatarURL({ dynamic: true }),
            })
            .setColor("RED")
            .setFooter({ text: "RPS" })
            .setDescription(`${opponent.user.tag} has declined your game!`)
          m.edit({
            embeds: [embed],
            components: [],
          })
        }
      })
    })
}

module.exports = rps
