/*
* In charge of kicking Members whenever they have not
*   - Agreed to the Rules
*   - Registered their Switch Code
*   - Typed a Message into the Intros Channel
* */

const helper = require('../helper');
const dbHandler = require('../storage/dbhandler');
const messages = require('../config/bot-text');

//Every 3 Days Cron Count
exports.cron = '0 0 */3 * *';

//Every Minute Cron count, used for debugging
exports.cron = '* * * * *';

exports.service = async (client) => {
    // Grab all the Profiles from our Userlist that are active.
    let profiles = await dbHandler.get('*', 'users', `status = '1'`);
    let flagged = [];

    // Loop through all the profiles adding ones that have not agreed to the rules or registered a Switch Code
    for(x in profiles) {
        let profile = profiles[x];
        if(profile.agreed !== 1 || profile['switch_code'] === null)
            flagged.push(profile);
    }

    console.log(flagged);
}
