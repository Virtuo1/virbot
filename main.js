const Discord = require('discord.js');
const logger = require('winston');
const package = require('./package.json');
const config = require('./config.json');
const prefix = config.prefix;

//
//  Commands
//

// Help Commands
exports.help = message => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Show all commands
    if (command === 'help') {
        const embed = new Discord.RichEmbed()
        .setColor(10181046)
        .setTitle("**Showing all commands**")
        .setDescription("Requested by " + message.member.user)
        .addField("Help", "```" + prefix + "help\n" + prefix + "info```", true)
        .addField("Utility", "```" + prefix + "flipcoin```", true)
        .addField("Games", "```" + prefix + "osu <gamemode> <username>```", true)
        .addField("Fun", "```" + prefix + "hitormiss```", true)
        .addField("Misc", "```" + prefix + "requestfeature\n" + prefix + "ping\n" + prefix + "username```", true)
        message.channel.send({embed})
    }

    // Info about the bot
    if (command === 'info') {
        const embed = new Discord.RichEmbed()
        .setColor(10181046)
        .setTitle("**Virbot**")
        .setDescription(package.description)
        .addField("Bot Version", package.version)
        .addField("Creator", package.author)
        .setURL("https://github.com/Virtuo1/virbot/")
        .setThumbnail("https://avatars.githubusercontent.com/u/37273266")
        message.channel.send({embed})
    }
}

// Utility commands
exports.utility = message => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Flip a coin
    if (command === 'flipcoin') {
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
}

// Fun commands
exports.fun = message => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // DAB
    if (command === 'hitormiss') {
        message.channel.send('I guess they never miss ***H U H ?***')
    }
}

// Commands for games
exports.games = message => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // osu!api
    if (command === 'osu') {
        let https = require('https');
        let mode = args[0];
        let user = args[1];

        if (user == null || mode == null) {
            message.channel.send({embed: {
                color: 15158332,
                description: "Missing parameter(s): `!osu <gamemode> <username>`"
            }});
        } else {
            let mode_id;
            if (mode == 'standard') {
                mode_id = 0;
            } else if (mode == 'taiko') {
                mode_id = 1;
            } else if (mode == 'ctb') {
                mode_id = 2;
            } else if (mode == 'mania') {
                mode_id = 3;
            }
            
            if (mode_id == null) {
                message.channel.send({embed: {
                    color: 15158332,
                    description: "Invalid gamemode, choose between: `standard, taiko, ctb, mania`"
                }});
            } else {
                https.get('https://osu.ppy.sh/api/get_user?k=' + process.env.OSU_API_KEY + '&m=' + mode_id + '&u=' + user, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    var osu_data = JSON.parse(data);
                    if (osu_data[0] === undefined) {
                        message.channel.send({embed: {
                            color: 15158332,
                            description: "User was not found"
                        }});
                    } else {
                        const embed = new Discord.RichEmbed()
                        .setColor(0xF26FC2)
                        .setTitle("**" + osu_data[0].username + "**")
                        .setDescription("Showing **osu!" + mode + "** stats of user " + osu_data[0].username)
                        .addField("Performance Points (pp)", parseFloat(osu_data[0].pp_raw).toFixed(2), true)
                        .addField("Accuracy", parseFloat(osu_data[0].accuracy).toFixed(2) + "%", true)
                        .addField("PP Rank", osu_data[0].pp_rank, true)
                        .addField("Ranked Score", osu_data[0].ranked_score, true)
                        .addField("Playcount", osu_data[0].playcount, true)
                        .addField("level", parseFloat(osu_data[0].level).toFixed(0), true)
                        .setFooter("Visit player profile for all stats")
                        .setURL("https://osu.ppy.sh/users/" + osu_data[0].user_id)
                        .setThumbnail("https://a.ppy.sh/" + osu_data[0].user_id)
                        message.channel.send({embed})
                        logger.info(message.member.user.tag + " issued osu!api GET request");
                    }
                });

                }).on("error", (err) => {
                    logger.warn("Error: " + err.message);
                });
            }
        }
    }
}

// Misc
exports.misc = message => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Link to feature request
    if (command === 'requestfeature') {
        const embed = new Discord.RichEmbed()
        .setColor(10181046)
        .setAuthor("Request a feature", "https://avatars.githubusercontent.com/u/37273266")
        .setTitle("Virbot Github Issues")
        .setURL("https://github.com/Virtuo1/virbot/issues")
        message.channel.send({embed})
    }

    // Ping command
    if (command === 'ping') {
        message.channel.send('Pong!');
    }

    // Echoes your username
    if (command === 'username') {
        message.channel.send('Your username is ' + message.member.user)
    }
}