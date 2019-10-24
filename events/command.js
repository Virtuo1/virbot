const Discord = require('discord.js');
const logger = require('winston');
const package = require('../package.json');
const functions = require('../functions');
const config = require('../config.json');
const pool = require('../db');

module.exports = message => {
    const serverid = message.guild.id;
    var prefix;
    let args = message.content.trim().split(/ +/g);
    let command = args.shift().toLowerCase();

    // Search for prefix in db. If it doesn't exist, create new entry and use default prefix 
    pool.query('SELECT prefix FROM guilds WHERE id = $1', [serverid], (err, res) => {
        if (err) {
            logger.warn(err.stack);
        } else {
            if (res.rowCount == 0) {
                pool.query('INSERT INTO guilds values($1, null, \'!\', 0, null)', [serverid], (err) => {
                    if (err) {
                        logger.warn(err.stack);
                    } else {
                        setPrefix(config.defaultPrefix);
                    }
                })
            } else {
                setPrefix(functions.queryResult(res, "prefix"));
            }
        }
    })

    // Set the prefix then check for command
    function setPrefix(value) {
        prefix = value;
        checkForCommand();
    }

    // Check for command
    function checkForCommand() {

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
            "shrug": {
                usage: prefix + "shrug",
                help: prefix + "shrug",
                description: "I dont know...",
                type: "fun",
                process: () => {
                    message.channel.send("¯\\_(ツ)_/¯");
                }
            },
            "8ball": {
                usage: prefix + "8ball",
                help: prefix + "8ball <question>",
                description: "Ask the 8ball anything!",
                type: "fun",
                process: () => {
                    let answerNumber = Math.floor(Math.random() * 20);
                    let answerMessage;
                    switch (answerNumber) {
                        case 0:
                            answerMessage = "It is certain.";
                            break;
                        case 1:
                            answerMessage = "It is decidedly so.";
                            break;
                        case 2:
                            answerMessage = "Without a doubt.";
                            break;
                        case 3:
                            answerMessage = "Yes - definitely.";
                            break;
                        case 4:
                            answerMessage = "You may rely on it.";
                            break;
                        case 5:
                            answerMessage = "As I see it, yes.";
                            break;
                        case 6:
                            answerMessage = "Most likely.";
                            break;
                        case 7:
                            answerMessage = "Outlook good.";
                            break;
                        case 8:
                            answerMessage = "Yes.";
                            break;
                        case 9:
                            answerMessage = "Signs point to yes.";
                            break;
                        case 10:
                            answerMessage = "Reply hazy, try again.";
                            break;
                        case 11:
                            answerMessage = "Ask again later.";
                            break;
                        case 12:
                            answerMessage = "Better not tell you now.";
                            break;
                        case 13:
                            answerMessage = "Cannot predict now.";
                            break;
                        case 14:
                            answerMessage = "Concentrate and ask again.";
                            break;
                        case 15:
                            answerMessage = "Don't count on it.";
                            break;
                        case 16:
                            answerMessage = "My reply is no.";
                            break;
                        case 17:
                            answerMessage = "My sources say no.";
                            break;
                        case 18:
                            answerMessage = "Outlook not so good.";
                            break;
                        case 19:
                            answerMessage = "Very doubtful.";
                            break;
                    }
                    message.channel.send(answerMessage);
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
            "about": {
                usage: prefix + "about",
                help: prefix + "about",
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
            "version": {
                usage: prefix + "version",
                help: prefix + "version",
                description: "The current version of Virbot",
                type: "info",
                process: () => {
                    const embed = new Discord.RichEmbed()
                    .setColor(10181046)
                    .addField("Version", "Running on version " + package.version)
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
                        let helpFieldAdministration = "```";
                        let helpFieldUtility = "```";
                        let helpFieldGames = "```";
                        let helpFieldFun = "```";
                        let helpFieldMisc = "```";
        
                        for (let i in commands) {
                            if (commands.hasOwnProperty(i)) {
                                if (commands[i].type == "info") {
                                    helpFieldInfo += commands[i].usage + "\n";
                                }

                                if (commands[i].type == "administration") {
                                    helpFieldAdministration += commands[i].usage + "\n";
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
                        helpFieldAdministration += "```";
                        helpFieldUtility += "```";
                        helpFieldGames += "```";
                        helpFieldFun += "```";
                        helpFieldMisc += "```";
        
                        let embed;

                        // Check if user has admin permissions
                        if (message.member.hasPermissions('ADMINISTRATOR')) {
                            embed = new Discord.RichEmbed()
                            .setColor(10181046)
                            .setTitle("**Showing all commands**")
                            .setDescription("Requested by " + message.member.user)
                            .addField("Help", helpFieldInfo, true)
                            .addField("Administration", helpFieldAdministration, true) // Admin permissions
                            .addField("Utility", helpFieldUtility, true)
                            .addField("Games", helpFieldGames, true)
                            .addField("Fun", helpFieldFun, true)
                            .addField("Misc", helpFieldMisc, true)
                            .setFooter(`Type ${prefix}help <command> for further help`)
                        } else {
                            embed = new Discord.RichEmbed()
                            .setColor(10181046)
                            .setTitle("**Showing all commands**")
                            .setDescription("Requested by " + message.member.user)
                            .addField("Help", helpFieldInfo, true)
                            .addField("Utility", helpFieldUtility, true)
                            .addField("Games", helpFieldGames, true)
                            .addField("Fun", helpFieldFun, true)
                            .addField("Misc", helpFieldMisc, true)
                            .setFooter(`Type ${prefix}help <command> for further help`)
                        }
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
            "roll": {
                usage: prefix + "roll",
                help: prefix + "roll <number>",
                description: "Roll a random number between your number and 1",
                type: "utility",
                process: () => {
                    let number = lastArg;

                    let regex = /[^0-9]/gi;

                    if (regex.test(number) == true || number == 0) {
                        message.channel.send({embed: {
                            color: 15158332,
                            description: "Invalid number"
                        }})
                    } else {
                        message.channel.send(Math.floor(Math.random() * number) + 1);
                    }
                }
            },
            "setprefix": {
                usage: prefix + "setprefix",
                help: prefix + "setprefix <prefix>",
                description: "Sets the prefix for Virbot's commands",
                type: "administration",
                process: () => {
                    let string = lastArg;

                    let regex = /([^A-Z0-9!?\/%&$])/gi;

                    if (!message.member.hasPermissions('ADMINISTRATOR')) {
                        message.channel.send({embed: {
                            color: 15158332,
                            description: "Insufficient permissions"
                        }})
                        return;
                    }

                    if (regex.test(string) == true) {
                        message.channel.send({embed: {
                            color: 15158332,
                            description: "Invalid character(s), choose between: `a-z, 0-9, !, ?, /, %, &, $`"
                        }})
                    } else if (string.length > 10) {
                        message.channel.send({embed: {
                            color: 15158332,
                            description: "Too long, 10 character limit."
                        }})
                    } else {
                        pool.query('UPDATE guilds SET prefix = $1 WHERE id = $2',[string, serverid], (err) => {
                            if (err) {
                                logger.warn(err.stack);
                            } else {
                                message.channel.send({embed: {
                                    color: 3066993,
                                    description: "Successfully updated prefix to `" + string + "`"
                                }})
                            }
                        })
                    }
                }
            },
            "togglewelcome": {
                usage: prefix + "togglewelcome",
                help: prefix + "togglewelcome <enable|disable>",
                description: "Enables or disables welcome message when new user joins",
                type: "administration",
                process: () => {
                    let string = lastArg;

                    // Check for permissions
                    if (!message.member.hasPermissions('ADMINISTRATOR')) {
                        message.channel.send({embed: {
                            color: 15158332,
                            description: "Insufficient permissions"
                        }})
                        return;
                    }

                    // Before enabling welcome message, check if welcome message and channel exists
                    pool.query('SELECT welcome FROM guilds WHERE id = $1', [serverid], (err, res) => {
                        if (err) {
                            logger.warn(err.stack);
                        } else if (functions.queryResult(res, "welcome", false) == "null") {
                            message.channel.send({embed: {
                                color: 15158332,
                                description: "No welcome message set, use `" + commands.welcomemessage.help + "`"
                            }})
                        } else {
                            pool.query('SELECT "welcomeChannel" FROM guilds WHERE id = $1', [serverid], (err, res) => {
                                if (err) {
                                    logger.warn(err.stack);
                                } else if (functions.queryResult(res, "welcomeChannel", false) == "null") {
                                    message.channel.send({embed: {
                                        color: 15158332,
                                        description: "No welcome channel set, use `" + commands.welcomechannel.help + "`"
                                    }})
                                } else {
                                    toggleWelcomeMessage()
                                }
                            })
                        }
                    })

                    // Finally, enable or disable the welcome message
                    function toggleWelcomeMessage() {
                        if (string == "enable") {
                            pool.query('UPDATE guilds SET "welcomeEnabled" = $1 WHERE id = $2', [1, serverid], (err, res) => {
                                if (err) {
                                    logger.warn(err.stack);
                                } else {
                                    message.channel.send({embed: {
                                        color: 3066993,
                                        description: "Successfully enabled welcome message"
                                    }})
                                }
                            })
                        } else if (string == "disable") {
                            pool.query('UPDATE guilds SET "welcomeEnabled" = $1 WHERE id = $2', [0, serverid], (err, res) => {
                                if (err) {
                                    logger.warn(err.stack);
                                } else {
                                    message.channel.send({embed: {
                                        color: 3066993,
                                        description: "Successfully disabled welcome message"
                                    }})
                                }
                            })
                        } else {
                            message.channel.send({embed: {
                                color: 15158332,
                                description: "Invalid argument, choose between: `enable, disable`"
                            }})
                        }
                    }
                }
            },
            "welcomechannel": {
                usage: prefix + "welcomechannel",
                help: prefix + "welcomechannel <channelID>",
                description: "Sets the channel to send welcome messages in",
                type: "administration",
                process: () => {
                    let channelID = lastArg;

                    // Check for permissions
                    if (!message.member.hasPermissions('ADMINISTRATOR')) {
                        message.channel.send({embed: {
                            color: 15158332,
                            description: "Insufficient permissions"
                        }})
                        return;
                    }

                    // Check if the given channel ID is valid
                    if (message.guild.channels.get(channelID) == undefined) {
                        message.channel.send({embed: {
                            color: 15158332,
                            description: "Invalid channel ID"
                        }})
                        return;
                    }

                    // Update the welcome channel
                    pool.query('UPDATE guilds SET "welcomeChannel" = $1 WHERE id = $2', [channelID, serverid], (err) => {
                        if (err) {
                            logger.warn(err.stack);
                        } else {
                            message.channel.send({embed: {
                                color: 3066993,
                                description: "Successfully set welcome channel"
                            }})
                        }
                    })

                }
            },
            "welcomemessage": {
                usage: prefix + "welcomemessage",
                help: prefix + "welcomemessage <message>",
                description: "Sets the welcome message, use %user% for user and %server% for this server",
                type: "administration",
                process: () => {
                    let string = lastArg;

                    // Check for permissions
                    if (!message.member.hasPermissions('ADMINISTRATOR')) {
                        message.channel.send({embed: {
                            color: 15158332,
                            description: "Insufficient permissions"
                        }})
                        return;
                    }

                    // Update welcome message
                    pool.query('UPDATE guilds SET welcome = $1 WHERE id = $2', [string, serverid], (err, res) => {
                        if (err) {
                            logger.warn(err.stack);
                        } else {
                            message.channel.send({embed: {
                                color: 3066993,
                                description: "Successfully set welcome message"
                            }})
                        }
                    })
                }
            }
        }

        for (let c in commands) {
            if (commands.hasOwnProperty(c)) {
                
                if (command === commands[c].usage) {
                    // Get number of args there is supposed to be
                    var trueArgs = commands[c].help.slice(prefix.length).split(/ +/g);
                    trueArgs.shift();

                    // If there are missing args, throw an error
                    if (args.length < trueArgs.length) {
                        message.channel.send({embed: {
                            color: 15158332,
                            description: "Missing parameter(s): `" + commands[c].help + "`"
                        }});
                    } else {

                        // Make the last arg contain all "args" seperated by spaces after the "true" last argument
                        var lastArg = args[trueArgs.length - 1];

                        for (let i = trueArgs.length - 1; i < args.length - 1; i++) {
                            lastArg += " " + args[i + 1];
                        }
                        
                        commands[c].process();

                    }
                }
            }
        }

    }
}
