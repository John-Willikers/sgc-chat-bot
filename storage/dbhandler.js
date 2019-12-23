const config = require('../config/storage');
const mysql = require('mysql');

class dbhandler {
    constructor() {
        this.connection = mysql.createConnection({
            host: config.sql.host,
            user: config.sql.user,
            password: config.sql.password,
            database: config.sql.database
        });
        this.connection.connect();
    }

    get(field, table, condition){
        return this.query(`SELECT ${field} FROM ${table} WHERE ${condition};`);
    }

    insert(table, fields, values) {
        return this.query(`INSERT INTO \`${table}\` (${fields}) VALUES (${values});`);
    }

    update(field, table, value, condition) {
        return this.query(`UPDATE \`${table}\` SET ${field} = '${value}' WHERE ${condition};`);
    }

    query(query){
        let connection = this.connection;
        return new Promise(function(resolve, reject) {

            connection.query(query, function (err, results, fields) {
                if(err) reject(err);
                resolve(results);
            });
        })
    }
}

module.exports = new dbhandler();
