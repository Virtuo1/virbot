const Discord = require('discord.js');
const logger = require('winston');
const package = require('../package.json');
const config = require('../config.json');

// Export commands
module.exports = message => {
    // Ping command
    if (message.content === config.prefix + 'ping') {
        message.channel.send('Pong!');
    }

    // Info about the bot
    if (message.content === config.prefix + 'info') {
        const embed = new Discord.RichEmbed()
        .setColor(3447003)
        .setTitle("Virbot")
        .setDescription(package.description)
        .addField("Bot Version", package.version)
        .addField("Creator", package.author)
        .setURL("https://github.com/Virtuo1/virbot/")
        .setThumbnail("https://avatars.githubusercontent.com/u/37273266")
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

    // Echoes your username
    if (message.content === config.prefix + 'username') {
        message.channel.send('Your username is '+message.member.user)
    }

    // DAB
    if (message.content === config.prefix + 'hitormiss') {
        message.channel.send('I guess they never miss ***H U H ?***')
    }
}