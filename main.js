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
    const args = message.content.trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Show all commands
    if (command === prefix + 'help') {
        const embed = new Discord.RichEmbed()
        .setColor(10181046)
        .setTitle("**Showing all commands**")
        .setDescription("Requested by " + message.member.user)
        .addField("Help", "```" + prefix + "help\n" + prefix + "info```", true)
        .addField("Utility", "```" + prefix + "flipcoin```", true)
        .addField("Games", "```" + prefix + "osu <gamemode> <username>```", true)
        .addField("Fun", "```" + prefix + "hitormiss\n" + prefix + "crabrave <something>```", true)
        .addField("Misc", "```" + prefix + "requestfeature\n" + prefix + "ping\n" + prefix + "username```", true)
        message.channel.send({embed})
    }

    // Info about the bot
    if (command === prefix + 'info') {
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
    const args = message.content.trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Flip a coin
    if (command === prefix + 'flipcoin') {
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
    const args = message.content.trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // DAB
    if (command === prefix + 'hitormiss') {
        message.channel.send('I guess they never miss ***H U H ?***')
    }

    if (command === prefix + 'crabrave') {
        let x = args[0];

        message.channel.send(":crab: " + x + " IS GONE :crab: " + x + " IS GONE :crab: " + x + " IS GONE :crab:")
    }
}

// Commands for games
exports.games = message => {
    const args = message.content.trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // osu!api
    if (command === prefix + 'osu') {
        let https = require('https');
        let mode = args[0];
        let user = args[1];

        for (let i = 1; i < args.length - 1; i++) {
            user += " " + args[i + 1];
        }

        var regex = /[a-z 0-9\-\_]/gi;

        if (user == null || mode == null) {
            message.channel.send({embed: {
                color: 15158332,
                description: "Missing parameter(s): `!osu <gamemode> <username>`"
            }});
        } else {
            var mode_id;
            if (mode == 'standard') {
                mode_id = 0;
            } else if (mode == 'taiko') {
                mode_id = 1;
            } else if (mode == 'ctb') {
                mode_id = 2;
            } else if (mode == 'mania') {
                mode_id = 3;
            }
            
            if (mode_id == null || regex.test(mode) == false) {
                message.channel.send({embed: {
                    color: 15158332,
                    description: "Invalid gamemode, choose between: `standard, taiko, ctb, mania`"
                }});
            } else if (regex.test(user) == false) {
                message.channel.send({embed: {
                    color: 15158332,
                    description: "User was not found"
                }});
            } else {
                get_data();
            }
        }

        // Get data through osu!api
        function get_data() {
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
                        function nrSep(n) {
                            return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        }

                        const embed = new Discord.RichEmbed()
                        .setColor(0xF26FC2)
                        .setAuthor(osu_data[0].username, "https://osu.ppy.sh/images/flags/" + osu_data[0].country + ".png")
                        .setDescription("Showing **osu!" + mode + "** stats of user [" + osu_data[0].username + "](https://osu.ppy.sh/users/" + osu_data[0].user_id + ")")
                        .addField("Performance Points (pp)", nrSep(parseFloat(osu_data[0].pp_raw).toFixed(2)), true)
                        .addField("Accuracy", parseFloat(osu_data[0].accuracy).toFixed(2) + "%", true)
                        .addField("Rank", nrSep(osu_data[0].pp_rank) + " (Global)\n" + nrSep(osu_data[0].pp_country_rank) + " (" + osu_data[0].country + ")", true)
                        .addField("Score", nrSep(osu_data[0].ranked_score) + " (Ranked)\n" + nrSep(osu_data[0].total_score) + " (Total)", true)
                        .addField("Playcount", nrSep(osu_data[0].playcount), true)
                        .addField("level", parseFloat(osu_data[0].level).toFixed(1), true)
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

// Misc
exports.misc = message => {
    const args = message.content.trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Link to feature request
    if (command === prefix + 'requestfeature') {
        const embed = new Discord.RichEmbed()
        .setColor(10181046)
        .setAuthor("Request a feature", "https://avatars.githubusercontent.com/u/37273266")
        .setTitle("Virbot Github Issues")
        .setURL("https://github.com/Virtuo1/virbot/issues")
        message.channel.send({embed})
    }

    // Ping command
    if (command === prefix + 'ping') {
        message.channel.send('Pong!');
    }

    // Echoes your username
    if (command === prefix + 'username') {
        message.channel.send('Your username is ' + message.member.user)
    }
}