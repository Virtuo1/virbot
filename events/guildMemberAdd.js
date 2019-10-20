const Discord = require('discord.js');
const logger = require('winston');
const functions = require('../functions');
const pool = require('../db');

module.exports = member => {
    var serverid = member.guild.id;

    pool.query('SELECT "welcomeEnabled" FROM guilds WHERE id = $1', [serverid], (err, res) => {
        if (err) {
            logger.warn(err.stack)
        } else {
            if (functions.queryResult(res, "welcomeEnabled", false) == 0) {
                return;
            } else {
                pool.query('SELECT "welcomeChannel" FROM guilds WHERE id = $1', [serverid], (err, res) => {
                    if (err) {
                        logger.warn(err.stack)
                    } else {
                        var channelID = functions.queryResult(res, "welcomeChannel");
                        pool.query('SELECT welcome FROM guilds WHERE id = $1', [serverid], (err, res) => {
                            if (err) {
                                logger.warn(err.stack)
                            } else {
                                if (member.guild.channels.get(channelID) == undefined) {
                                    return;
                                } else {
                                    var welcome = functions.queryResult(res, "welcome");
                                    welcome = welcome.replace("%user%", member);
                                    welcome = welcome.replace("%server%", member.guild);
                                    member.guild.channels.get(channelID).send(welcome);
                                }
                            }
                        })
                    }
                })
            }
        }
    })
}