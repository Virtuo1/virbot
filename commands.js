const Discord = require('discord.js');
const logger = require('winston');
const package = require('./package.json');
const functions = require('./functions');
const config = require('./config.json');
const prefix = config.prefix;

module.exports = message => {
    let args = message.content.trim().split(/ +/g);
    let command = args.shift().toLowerCase();

    const commands = {
        "crabrave": {
            usage: prefix + "crabrave",
            help: prefix + "crabrave <something>",
            description: "Throw a crab party",
            type: "fun",
            process: () => {
                message.channel.send(":crab: " + lastArg.toUpperCase() + " IS GONE :crab: " + lastArg.toUpperCase() + " IS GONE :crab: " + lastArg.toUpperCase() + " IS GONE :crab:")
            }
        },
        "hitormiss": {
            usage: prefix + "hitormiss",
            help: prefix + "hitormiss",
            description: "Hit or miss?",
            type: "fun",
            process: () => {
                message.channel.send('I guess they never miss ***H U H ?***')
            }
        },
        "osu": {
            usage: prefix + "osu",
            help: prefix + "osu <gamemode> <user>",
            description: "Get stats from an osu! profile",
            type: "games",
            process: () => {
                let https = require('https');
                let mode = args[0];
                let user = lastArg;
        
                let regex = /[a-z0-9 -_]/gi;
        
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
                                    let embed = new Discord.RichEmbed()
                                    .setColor(0xF26FC2)
                                    .setAuthor(osu_data[0].username, "https://osu.ppy.sh/images/flags/" + osu_data[0].country + ".png")
                                    .setDescription("Showing **osu!" + mode + "** stats of user [" + osu_data[0].username + "](https://osu.ppy.sh/users/" + osu_data[0].user_id + ")")
                                    .addField("Performance Points (pp)", functions.nrSep(parseFloat(osu_data[0].pp_raw).toFixed(2)), true)
                                    .addField("Accuracy", parseFloat(osu_data[0].accuracy).toFixed(2) + "%", true)
                                    .addField("Rank", (osu_data[0].pp_rank) + " (Global)\n" + functions.nrSep(osu_data[0].pp_country_rank) + " (" + osu_data[0].country + ")", true)
                                    .addField("Score", functions.nrSep(osu_data[0].ranked_score) + " (Ranked)\n" + functions.nrSep(osu_data[0].total_score) + " (Total)", true)
                                    .addField("Playcount", functions.nrSep(osu_data[0].playcount), true)
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
        },
        "info": {
            usage: prefix + "info",
            help: prefix + "info",
            description: "Info about the bot",
            type: "info",
            process: () => {
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
        },
        "help": {
            usage: prefix + "help",
            help: prefix + "help",
            description: "Get help with commands",
            type: "info",
            process: () => {
                lastArg = args[0];

                for (let i = 0; i < args.length - 1; i++) {
                    lastArg += " " + args[i + 1];
                }

                if (lastArg !== undefined) {
                    for (let i in commands) {
                        if (commands.hasOwnProperty(i)) {
                            if (commands[i].usage.slice(prefix.length) == lastArg) {
                                var helpArg = true

                                message.channel.send({embed: {
                                    color: 10181046,
                                    description: commands[i].description + " `" + commands[i].help + "`"
                                }});
                            }
                        }
                    }

                    if (helpArg !== true) {
                        message.channel.send({embed: {
                            color: 15158332,
                            description: "That command does not exist"
                        }});
                    }
                    
                } else {
                    let helpFieldInfo = "```";
                    let helpFieldUtility = "```";
                    let helpFieldGames = "```";
                    let helpFieldFun = "```";
                    let helpFieldMisc = "```";
    
                    for (let i in commands) {
                        if (commands.hasOwnProperty(i)) {
                            if (commands[i].type == "info") {
                                helpFieldInfo += commands[i].usage + "\n";
                            }
    
                            if (commands[i].type == "utility") {
                                helpFieldUtility += commands[i].usage + "\n";
                            }
    
                            if (commands[i].type == "games") {
                                helpFieldGames += commands[i].usage + "\n";
                            }
    
                            if (commands[i].type == "fun") {
                                helpFieldFun += commands[i].usage + "\n";
                            }
    
                            if (commands[i].type == "misc") {
                                helpFieldMisc += commands[i].usage + "\n";
                            }
                        }
                    }
    
                    helpFieldInfo += "```";
                    helpFieldUtility += "```";
                    helpFieldGames += "```";
                    helpFieldFun += "```";
                    helpFieldMisc += "```";
    
                    const embed = new Discord.RichEmbed()
                    .setColor(10181046)
                    .setTitle("**Showing all commands**")
                    .setDescription("Requested by " + message.member.user)
                    .addField("Help", helpFieldInfo, true)
                    .addField("Utility", helpFieldUtility, true)
                    .addField("Games", helpFieldGames, true)
                    .addField("Fun", helpFieldFun, true)
                    .addField("Misc", helpFieldMisc, true)
                    .setFooter("Type !help <command> for further help")
                    message.channel.send({embed})
                }
            }
        },
        "ping": {
            usage: prefix + "ping",
            help: prefix + "ping",
            description: "Pong!",
            type: "misc",
            process: () => {
                message.channel.send('Pong!')
            }
        },
        "requestfeature": {
            usage: prefix + "requestfeature",
            help: prefix + "requestfeature",
            description: "Request a feature",
            type: "misc",
            process: () => {
                if (command === prefix + 'requestfeature') {
                    const embed = new Discord.RichEmbed()
                    .setColor(10181046)
                    .setAuthor("Request a feature", "https://avatars.githubusercontent.com/u/37273266")
                    .setTitle("Virbot Github Issues")
                    .setURL("https://github.com/Virtuo1/virbot/issues")
                    message.channel.send({embed})
                }
            }
        },
        "flipcoin": {
            usage: prefix + "flipcoin",
            help: prefix + "flipcoin",
            description: "Flip a coin",
            type: "utility",
            process: () => {
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
        },
        "rolldice": {
            usage: prefix + "roll",
            help: prefix + "roll <number>",
            description: "Roll a random number between 1 and your number",
            type: "utility",
            process: () => {
                let number = lastArg;

                let regex = /[0-9]/gi;

                if (regex.test(number) == false) {
                    message.channel.send({embed: {
                        color: 15158332,
                        description: "Invalid number"
                    }})
                } else {
                    message.channel.send(Math.floor(Math.random() * number) + 1);
                }
            }
        }
    }

    for (let i in commands) {
        if (commands.hasOwnProperty(i)) {
            
            if (command === commands[i].usage) {
                // Get number of args there is supposed to be
                var trueArgs = commands[i].help.slice(prefix.length).split(/ +/g);
                trueArgs.shift();

                // If there are missing args, throw an error
                if (args.length < trueArgs.length) {
                    message.channel.send({embed: {
                        color: 15158332,
                        description: "Missing parameter(s): `" + commands[i].help + "`"
                    }});
                } else {

                    // Make the last arg contain all "args" seperated by spaces after the "true" last arg
                    var lastArg = args[trueArgs.length - 1];

                    for (let i = trueArgs.length - 1; i < args.length - 1; i++) {
                        lastArg += " " + args[i + 1];
                    }
                    
                    commands[i].process();

                }
            }
        }
    }
}