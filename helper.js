const dbHandler = require('./storage/dbhandler');

var handleCommand = async function(target, context, msg, tokens) {
    return new Promise( async function(resolve, reject ) {
        let msgs = msg.split(" ");

        let command = {
            type: msgs[0].substr(1, (msgs[0].length - 1)),
            target: null,
            arguments: {}
        };

        for (let a = 1; a < msgs.length; a++) {

            let msg = msgs[a];
            let flag = msg.charAt(0);
            msg = msg.substr(1, (msg.length - 1));

            if (flag === "-") {
                let broken = msg.split("=");
                (broken.length === 2) ? command.arguments[broken[0]] = broken[1] : command.arguments[broken[0]] = null;
            } else if (flag === "@") {
                await getUserID(msg).then(function(value) {
                    command.target = value;
                });
            } else {
                console.log('bad argument', flag + msg);
            }
        }

        resolve(command);
    })
};

var userExists = async function(id) {
    let profile = [];

    await dbHandler.get('*', 'users', `discord_id = ${id}`)
        .then(function(value) {
            profile = value;
        });

    if(profile.length===0) {
        await dbHandler.insert('users', 'discord_id', `'${id}'`)
            .then(function(value) {
                profile = value;
            })
    }

    return profile[0];
};

var validSwitchCode = function(code) {
    code = code.split("-");

    const flag = new RegExp('([^0-9])');
    if(code.length !== 4 || code[0] !== "SW" || code[1].search(flag) !== -1 || code[2].search(flag) !== -1 || code[3].search(flag)!== -1) return false;

    return true;
};

var uniqueSwitchCode = async function(code) {
    let response = true;

    profile = await dbHandler.get('*', 'users', `switch_code = '${code}'`)
        .then( (value) => {
            if(value.length > 0)
                response = false;
        }).catch( (err) => {
            console.error(err);
        });

    return response;
}

var addGame = async function(game) {
    let exists = await gameExists(game['store_id']);

    if(!exists) {
        await dbHandler.insert('games', 'store_id, type, title, url, msrp',
            `'${game['store_id']}', '${game.type}', '${game.title}', '${game.url}', '${game.msrp}'`)
            .then( (value) => {
                return value;
            }).catch( (err) => {
                console.error(err);
            });
    } else {
        return false;
    }
}
var gameExists = async function(store_id) {
    let exists = false;
    let game = await dbHandler.get('*', 'games', `store_id = '${store_id}'`)
        .then((value) => {
            if(value.length === 1)
                exists = true;
        }).catch( (err) => {
            console.error(err);
        });

    return exists;
}

var grammarOwner = function(name) {
    if(name.charAt(name.length-1) === "s")
        return name+"'"
    else
        return name+"'s";
}

module.exports.handleCommand = handleCommand;
module.exports.userExists = userExists;
module.exports.validSwitchCode = validSwitchCode;
module.exports.uniqueSwitchCode = uniqueSwitchCode;
module.exports.addGame = addGame;
module.exports.gameExists = gameExists;
module.exports.grammerOwner = grammarOwner;
