const Discord = require('discord.js');
const logger = require('winston');
const package = require('./package.json');

// Require commands
const command = require('./commands');

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
    logger.info('Logged in as:');
    logger.info(bot.user.username + " | Running on version " + package.version);

    bot.user.setPresence({
        game: {
            name: 'commands',
            type: 'LISTENING'
        },
        status: 'online'
    });
});

bot.on('message', command);