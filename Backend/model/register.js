/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-console */

//= ======================================================
//              Imports
//= ======================================================
// intialising pool
const pool = require('../controller/databaseConfig');

//= ======================================================
//              Functions / Objects
//= ======================================================
const Register = {

  // eslint-disable-next-line max-len
  registerCustomer(FirstName, LastName, Password, Email, Address, PhoneNumber, PostalCode, callback) {
    // sql query statement

    const sql = `
        INSERT INTO
        heroku_6b49aedb7855c0b.customer (
        FirstName,
        LastName, 
        Password,
        Email,
        Address,
        PhoneNumber,
        PostalCode,
        Status)
        VALUES
        (?,?,?,?,?,?,?,'active');
    `;
    // pool query
    // eslint-disable-next-line max-len
    pool.query(sql, [FirstName, LastName, Password, Email, Address, PhoneNumber, PostalCode], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      console.log(result);
      // result accurate
      return callback(null, result);

      // pool.end()
    });
  },

};

//= ======================================================
//              Exports
//= ======================================================
module.exports = Register;
