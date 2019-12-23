const messages = require('../config/bot-text');
const helper = require('../helper.js');
const settings = require('../config/settings');

module.exports = async (client, message) => {
    if(message.author.bot) return;

    let profile = await helper.userExists(message.member.user.id);

    // if(profile['switch_code'] === null) {
    //     message.delete();
    //     message.author.sendMessage(messages['no-switch']);
    //     return;
    // }

    if(message.content.indexOf(settings.prefix) === 0) {
        const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        const cmd = client.commands.get(command);

        if(!cmd) message.channel.sendMessage(`The Command ${command} does not exist`);

        cmd.run(client, profile, message, args);
    }

}
