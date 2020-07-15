const Discord = require('discord.js');
const bot = new Discord.Client();

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('guildMemberAdd', async member => {
  verifyAge(member, 0);
});

bot.on("guildCreate", async (guild) => {
  getNotVerifiedRole(guild);
});

/**
 * 
 * @param {Discord.GuildMember | Discord.PartialGuildMember} member
 * @param {number} tryCount the number of times they have responded
 */
async function getVerifyResponse(member, tryCount) {
  try {
    let verify = new Discord.MessageEmbed()
      .setColor("ORANGE")
      .setDescription("The server you joined requires that you verify your age. Please reply with your age");
    if (tryCount < 1) {
      verify.setFooter("Reply within 1 day");
    } else {
      verify.setFooter("Last Attempt");
    }
    //initial embed that gets send to user DM
    let message = await member.send({
      embed: verify
    });
    const filter = response => response;
    const options = {
      time: 86400000,
      max: 1
    };
    // @ts-ignore
    const collector = new Discord.MessageCollector(message.channel, filter, options);
    // collect messages from DM channel, uses channel ID from above, awaiting up to 1 messages in the DM channel.
    const msg = await collector.next;
    const value = Number.parseInt(msg.cleanContent);
    if (Number.isInteger(value)) {
      return value;
    } else {
      return 999;
    }
  } catch (error) {
    console.error('error in getVerifyResponse', error);
    throw error;
  }
}

/**
 * 
 * @param {Discord.GuildMember | Discord.PartialGuildMember} member 
 * @param {number} tryCount 
 */
async function verifyAge(member, tryCount) {
  try {
    let guild = member.guild;
    let role = await getNotVerifiedRole(guild);
    if (!member.roles.cache.some(role => role.name === "age-not-verified")) {
      await member.roles.add(role);
    }

    let response = await getVerifyResponse(member, tryCount);
    if (response < 13) {
      let under13 = new Discord.MessageEmbed()
        .setColor("RED")
        .setDescription("**BANNED, because Discord doesn't allow users under 13. https://discord.com/terms**");
      await member.send(under13);
      member.ban();
    } else if (response > 100) {
      if (tryCount < 1) {
        let over100 = new Discord.MessageEmbed()
          .setColor("ORANGE")
          .setDescription("Haha very funny, **one remaining try**");
        await member.send(over100);
        verifyAge(member, tryCount + 1);
      } else {
        let over100Banned = new Discord.MessageEmbed()
          .setColor("ORANGE")
          .setDescription("Haha very funny, **BANNED**");
        await member.send(over100Banned);
        member.ban();
      }
    } else {
      let enter = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setDescription("**You've been verified.**");
      await member.send(enter);
      member.roles.remove(role);
    }
  } catch (error) {
    console.error('error in verifyage:', error);
  }
}

/**
 * Gets age-not-verified role if it exists, if not creates the role and returns it.
 * @param {Discord.Guild} guild 
 * @returns {Promise<Discord.Role>}
 */
async function getNotVerifiedRole(guild) {
  try {
    let role = guild.roles.cache.find(r => r.name === 'age-not-verified');
    if (!role) {
      role = await guild.roles.create({
        data: {
          name: "age-not-verified",
          color: "#2f3136",
          permissions: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ADD_REACTIONS']
        }
      });
      guild.channels.cache.forEach(c => {
        c.overwritePermissions([
          {
            id: role,
            deny: ['VIEW_CHANNEL']
          }
        ]);
      });
    }
    return role;
  } catch (error) {
    console.error('error in getNotVerifiedRole', error);
    throw error;
  }
}
bot.login(process.env.token);
