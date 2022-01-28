/**
 * Send a Message to someone
 * in a Guild#Channel
 * when they Leave

 * @param {client} => Your Discordjs Client/Bot
 * @param {options} => Config Options

*/

// Required Modules
const { Intents } = require("discord.js")

// For Checking Discord.js's Version later in code:
const DiscordJSVersion = require("discord.js").version.substring(0, 2)

// For Checking Correct Intents & Params later in code:
const reqInt = ["GUILDS", "GUILD_MEMBERS"]

async function leave(client, options) {
  // DiscordJS Version Check
  if (DiscordJSVersion !== "13") {
    throw new Error(
      "Your Version of Discord.js is too old. shift to v13 to use this Module."
    )
  }

  // Intents Check
  const intents = new Intents(client.options.intents)
  if (!intents.has(reqInt)) {
    for (abc = 0; abc < reqInt.length; abc++) {
      if (!intents.has(reqInt[abc])) {
        throw new Error(
          `Leave Message: You need ${reqInt[abc]} Intent in your Discord Client to use Welcome Function.`
        )
      }
    }
  }

  // Params Check
  const params = client.options.params
  let t
  if (!params) {
    throw new Error(
      `Leave Message: You forgot to use CHANNEL PARAM in your Discord Client.`
    )
  }
  for (xyz = 0; xyz < params.length; xyz++) {
    if (params[xyz] === "CHANNEL") {
      t++
    }
  }

  if (t <= 0) {
    throw new Error(
      `Leave Message: You forgot to use a PARAM [CHANNEL] in your discordjs Client.`
    )
  }

  // The Real Game Starts!!!!!

  // Event Trigger
  client.on("guildMemberRemove", async (member) => {
    // Set options
    let ChannelMessage =
      (options && options.message) ||
      (options[member.guild.id] && options[member.guild.id].message) ||
      null

    let ChannelId =
      (options && options.channelId) ||
      (options[member.guild.id] && options[member.guild.id].channelId) ||
      null

    // Message is Public
    if (ChannelMessage && ChannelId) {
      let channel = member.guild.channels.cache.get(ChannelId)
      if (!channel) {
        throw new Error(
          `Leave Message: Module was unable to find any channel with ID: ${ChannelId}.`
        )
      } else {
        if (channel.permissionsFor(client.user).has("SEND_MESSAGES")) {
          let msg = ChannelMessage

          // FLAGS
          msg = msg.replace(`@MEMBER`, `${member.user.tag}`)
          msg = msg.replace(`@GUILDNAME`, `${member.guild.name}`)

          channel.send({
            content: msg,
          })
        } else {
          throw new Error(
            `Leave Message: Bot Lacks Permission to send Welcome Message in ${channel.name}`
          )
        }
      }
    }
  })
}

module.exports = leave
