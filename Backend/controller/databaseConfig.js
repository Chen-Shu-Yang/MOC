/* eslint-disable linebreak-style */
/* eslint-disable no-console */
// sanity check
console.log('--------------------------------------');
console.log('databaseconfig.js');
console.log('--------------------------------------');

//= ======================================================
//              Imports
//= ======================================================
const mysql = require('mysql');

//= ======================================================
//              Objects / Functions
//= ======================================================
const dbconnect = {
  getConnection() {
    const conn = mysql.createConnection({
      host: 'us-cdbr-east-05.cleardb.net',
      user: 'bd926a7014f79f',

      password: '34f39a33',

      database: 'heroku_6b49aedb7855c0b',
    });
    return conn;
  },
};

//= ======================================================
//              Exports
//= ======================================================
module.exports = dbconnect;
