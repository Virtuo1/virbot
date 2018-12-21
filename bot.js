const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';

var bot = new Discord.Client({
    token: auth.token || process.env.TOKEN,
    autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.setPresence({ status: 'online', game: { name: 'with fire.' } });

bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
            break;

            case 'username':
                bot.sendMessage({
                    to: channelID,
                    message: 'Your username is '+user+'!'
                })
            break;

            case 'hitormiss':
                bot.sendMessage({
                    to: channelID,
                    message: 'I guess they never miss ***H U H ?***'
                })
            break;

            case 'bot':
                bot.sendMessage({
                    to: channelID,
                    message: 'Creator: Virtuo \nGithub: https://github.com/Virtuo1/virbot/'
                })
            break;
        }
    }
});
