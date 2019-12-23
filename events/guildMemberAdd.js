const messages = require('../config/bot-text');

module.exports = (client, member) => {
    member.send(messages.welcome);
}
