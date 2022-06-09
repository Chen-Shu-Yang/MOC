/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable max-len */

//= ======================================================
//              Imports
//= ======================================================
const pool = require('../controller/databaseConfig');

//= ======================================================
//              Functions / Objects
//= ======================================================
const Profile = {
  // get all class of services
  getCustomerById(cID, callback) {
    // sql query statement
    const sql = 'SELECT FirstName, LastName, Email, Address, PhoneNumber,PostalCode FROM heroku_6b49aedb7855c0b.customer WHERE CustomerID = ?;';

    // pool query
    pool.query(sql, [cID], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      // any results?
      if (result.length === 0) {
        // no results - callback with no err & results
        console.log('this is null');
        return callback(null, null);
      }
      // one result - returns result
      console.log(result);
      return callback(null, result);
    });
  },

};

//= ======================================================
//              Exports
//= ======================================================
module.exports = Profile;
