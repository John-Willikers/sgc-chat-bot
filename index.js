// Yarn Modules
const Discord = require("discord.js");
const schedule = require('node-schedule');
const fs = require('fs');
const Enmap = require('enmap');
const { getGamesAmerica, getGamesEurope, getGamesJapan } = require('nintendo-switch-eshop');

// Project Imports
const helper = require('./helper');
const client = new Discord.Client();
const settings = require('./config/settings');
const countries = require('./config/countries');

client.commands = new Enmap();
client.countries = new Enmap();
client.services = new Enmap();

// Setup our internal Countries
for(let a=0; a<countries.length; a++) {
    client.countries.set(countries[a]['name'].toLowerCase(), countries[a].code);
}

// Grab Games from NA Library
getGamesAmerica()
    .then( async (value) => {
        await value.forEach( game => {
            helper.addGame({
                "store_id": game.nsuid,
                type: game.type,
                title: game.title.replace(/'/g, "\\'"),
                url: game.url,
                msrp: game.msrp
            });
        });
        console.log(`America Library Count: ${value.length}`);
    });

// Register Events
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

// Register Commands
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
});

// Register Services
fs.readdir("./services/", (err, files) => {
    if(err) return console.error(err);

    console.log(`\nAttempting to Load ${files.length} services`);

    files.forEach(file => {
        if(!file.endsWith(".js")) return;

        let props = require(`./services/${file}`);
        let serviceName = file.split(".")[0];

        console.log(`Attempting to load service ${serviceName} running (${props.cron})`);

        client.services.set(serviceName, schedule.scheduleJob(props.cron, props.service));
    });
});

// Log our Bot in
client.login(settings.secret);
