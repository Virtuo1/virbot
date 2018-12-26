const Discord = require('discord.js');
const logger = require('winston');
const package = require('./package.json');
const config = require('./config.json');

// Require commands
const commands = require('./main');

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

// Commands
bot.on('message', commands.help);
bot.on('message', commands.utility);
bot.on('message', commands.fun);
bot.on('message', commands.games);
bot.on('message', commands.misc);