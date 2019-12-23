const helper = require('../helper');
const dbHandler = require('../storage/dbhandler');
const messages = require('../config/bot-text');

exports.run = async (client, profile, message, args) => {
    message.delete();

    args.forEach( async arg => {
        arg = arg.split('=');
        if(arg.length !== 2) message.author.send(`${args[0]} is missing its value. Please follow it with = [value]`);

        switch(arg[0]) {
            case "-search":
                console.log('Game -search hit');
                break;
        }
    });
}
