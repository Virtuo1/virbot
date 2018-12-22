const Discord = require('discord.js');
const logger = require('winston');
const package = require('./package.json');
const config = require('./config.json');

// Require commands
const main_cmd = require('./commands/main');

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';

// Create bot client & login
const bot = new Discord.Client();

bot.login(process.env.TOKEN);

// On ready
bot.on('ready', () => {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.username + ' - (' + bot.user.id + ')');
    logger.info('Running on version ' + package.version);

    bot.user.setPresence({
        game: {
            name: 'commands',
            type: 'LISTENING'
        },
        status: 'online'
    });
});

// Commands
bot.on('message', main_cmd);
