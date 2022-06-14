/* eslint-disable linebreak-style */
/* eslint-disable no-console */

//= ======================================================
//              Imports
//= ======================================================
const pool = require('../controller/databaseConfig');

//= ======================================================
//              Functions / Objects
//= ======================================================
const Customer = {
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

  updateCustProfile(firstName, lastName, address, postal, phone, email, id, callback) {
    // sql query statement
    const sql = `
            UPDATE 
            heroku_6b49aedb7855c0b.customer
         SET
            FirstName=?,
            LastName=?,
            Address=?,
            PostalCode=?,
            PhoneNumber=?,
            Email=?
        where
            CustomerID=?
             ;
            `;
    // pool query
    pool.query(sql, [firstName, lastName, address, postal, phone, email, id], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },
};

//= ======================================================
//              Exports
//= ======================================================
module.exports = Customer;
