const Discord = require('discord.js');
const logger = require('winston');
const package = require('../package.json');
const config = require('../config.json');

// Export commands
module.exports = message => {

    // Show all commands
    if (message.content === config.prefix + 'help') {
        const embed = new Discord.RichEmbed()
        .setColor(10181046)
        .setTitle("**Showing all commands**")
        .setDescription("Requested by " + message.member.user)
        .addField("Help", "```" + config.prefix + "help\n" + config.prefix + "info```", true)
        .addField("Utility", "```" + config.prefix + "requestfeature\n" + config.prefix + "flipcoin```", true)
        .addField("Fun", "```" + config.prefix + "hitormiss```", true)
        .addField("Misc", "```" + config.prefix + "ping\n" + config.prefix + "username```", true)
        message.channel.send({embed})
    }

    // Info about the bot
    if (message.content === config.prefix + 'info') {
        const embed = new Discord.RichEmbed()
        .setColor(3447003)
        .setTitle("**Virbot**")
        .setDescription(package.description)
        .addField("Bot Version", package.version)
        .addField("Creator", package.author)
        .setURL("https://github.com/Virtuo1/virbot/")
        .setThumbnail("https://avatars.githubusercontent.com/u/37273266")
        message.channel.send({embed})
    }

    // Link to feature request
    if (message.content === config.prefix + 'requestfeature') {
        const embed = new Discord.RichEmbed()
        .setColor(15158332)
        .setAuthor("Request a feature", "https://avatars.githubusercontent.com/u/37273266")
        .setTitle("Virbot Github Issues")
        .setURL("https://github.com/Virtuo1/virbot/issues")
        message.channel.send({embed})
    }

    // Flip a coin
    if (message.content === config.prefix + 'flipcoin') {
        if (Math.round(Math.random()) == 1) {
            message.channel.send({embed: {
                color: 15844367,
                description: "Heads"
            }});
        } else {
            message.channel.send({embed: {
                color: 15105570,
                description: "Tails"
            }});
        }
    }

    // Ping command
    if (message.content === config.prefix + 'ping') {
        message.channel.send('Pong!');
    }

    // Echoes your username
    if (message.content === config.prefix + 'username') {
        message.channel.send('Your username is '+message.member.user)
    }

    // DAB
    if (message.content === config.prefix + 'hitormiss') {
        message.channel.send('I guess they never miss ***H U H ?***')
    }
}