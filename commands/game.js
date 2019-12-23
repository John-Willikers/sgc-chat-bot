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
                dbHandler.get('*', 'games', `title LIKE '%${arg[1]}%'`)
                    .then( games => {
                        let response = `\nGames Containing ${arg[1]} in the title are:\n`;
                        games.forEach( game => {
                            response = response + `  - (${game.id}) ${game.title}\n`;
                        });

                        message.channel.send(response);
                    }).catch( err => {
                        console.error(err);
                    });
                break;

            case "-add":
                let userGames = profile['games_list'];
                let game = {};

                await dbHandler.get('*', 'games', `id = '${arg[1]}'`)
                    .then( (value) => {
                        game = value[0];
                    });

                if(game === undefined) {
                    message.author.send(`A game with the ID of ${arg[1]} does not exist.`);
                    return;
                }

                if(userGames.length === 0) {
                    dbHandler.update('games_list', 'users', `${arg[1]}`, `id = '${profile.id}'`)
                        .then( (value) => {
                            console.log(value);
                        }).catch( (err) => {
                            console.error(err);
                    });
                } else {
                    if(userGames.includes(arg[1])) {
                        message.author.send(`${game.title} already exists in your library`);
                        return;
                    }
                    let newGames = userGames+`,${arg[1]}`;

                    dbHandler.update('games_list', 'users', `${newGames}`, `id = '${profile.id}'`)
                        .then( (value) => {
                            console.log(value);
                        }).catch( (err) => {
                        console.error(err);
                    });
                }

                message.author.send(`You have added ${game.title} to your library.`);
                break;
        }
    });
}
