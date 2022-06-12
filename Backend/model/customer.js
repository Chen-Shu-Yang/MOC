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

  // get employees scheduled as available for booking
  possibleAvailableHelpers(bookingDate, callback) {
    // sql query statement
    const sql = `
      SELECT 
        e.EmployeeName,e.EmployeeDes,e.EmployeeImgUrl,DATE_FORMAT(s.ScheduleDate,'%Y-%m-%d') AS FormatScheduleDate,e.EmployeeID, e.Skillsets
      FROM 
        heroku_6b49aedb7855c0b.employee AS e
      LEFT JOIN 
        heroku_6b49aedb7855c0b.schedule AS s ON e.EmployeeID = s.Employee
      Having 
        FormatScheduleDate= ?;`;

    const values = [bookingDate];
    // pool query
    pool.query(sql, values, (err, result) => {
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
