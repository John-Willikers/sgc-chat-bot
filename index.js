const Discord = require("discord.js");
const fs = require('fs');
const Enmap = require('enmap');

const client = new Discord.Client();
const settings = require('./config/settings');

fs.readdir('./events', (err, files) => {
    if(err) return console.error(err);

    console.log(`Attempting to Load ${files.length} events`);

    files.forEach( file => {
        if(!file.endsWith(".js")) return;

        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];

        console.log(`Attempting to load event ${eventName}`);

        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)];
    })
});

client.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
    if(err) return console.error(err);

    console.log(`\nAttempting to Load ${files.length} commands`);

    files.forEach(file => {
        if(!file.endsWith(".js")) return;

        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];

        console.log(`Attempting to load command ${commandName}`);
        client.commands.set(commandName, props);
    });
})

client.login(settings.secret);
