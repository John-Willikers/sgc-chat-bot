const helper = require('../helper');
const dbHandler = require('../storage/dbhandler');
const messages = require('../config/bot-text');

exports.run = async (client, profile, message, args) => {
    message.delete();

    //is our command a Mention, if so we search their profile
    if(args.length === 1 && args[0].includes("@"))
    {
        let mentioned = message.mentions.members.first().user;
        let profile = await helper.userExists(mentioned.id);
        let switchCode = (profile['switch_code'] === null) ? 'Not Available' : profile['switch_code'];

        message.author.send(`${helper.grammerOwner(mentioned.username)} switch code is ${switchCode}`);
    } else {
        args.forEach( async arg => {
            arg = arg.split('=');
            if(arg.length !== 2) message.author.send(`${args[0]} is missing its value. Please follow it with = [value]`);

            switch(arg[0]) {
                case "-sw":
                    //Is our Switch Online Code Valid
                    if(helper.validSwitchCode(arg[1])){
                        //Is our Switch Online Code Unique
                        let unique = await helper.uniqueSwitchCode(arg[1]);
                        if(unique) {
                            dbHandler.update('switch_code', 'users', arg[1], `id = ${profile.id}`)
                                .then((value) => {
                                    message.author.send(`I have set your Switch Online Code to ${arg[1]}, thanks for using our service.`);
                                });
                        } else {
                            message.author.send(`The Switch Code ${arg[1]} has already been claimed, if you believe this is an error please message a Mod.`);
                        }

                    } else {
                        message.author.send(messages['invalid-switch']);
                    }
                break;
            }
        });
    }
}
