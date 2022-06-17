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

<<<<<<< Updated upstream
  // add contract of services
  addContract(
    // eslint-disable-next-line no-shadow
    Customer,
    StartDate,
    Package,
    DayOfService,
    DayOfService2,
    TimeOfService,
    EstimatedPricing,
    ExtraNotes,
    NoOfRooms,
    NoOfBathrooms,
    Address,
    Class,
    Rate,
    ExtraService,
    callback,
  ) {
    // sql query statement
    const sql = `
      INSERT INTO
        heroku_6b49aedb7855c0b.contract (
          Customer,
          StartDate, 
          Package,
          DayOfService,
          DayOfService2,
          TimeOfService,
          EstimatedPricing,
          ExtraNotes,
          NoOfRooms,
          NoOfBathrooms,
          Address,
          Class,
          Rate,
          ExtraService)
      VALUES
        (?,?,?,?,?,?,?,?,?,?,?,?,?,?);
    `;
    // pool query
    pool.query(sql, [
      Customer,
      StartDate,
      Package,
      DayOfService,
      DayOfService2,
      TimeOfService,
      EstimatedPricing,
      ExtraNotes,
      NoOfRooms,
      NoOfBathrooms,
      Address,
      Class,
      Rate,
      ExtraService,
      callback], (err, result) => {
=======
  // get all class of services
  getAllClassOfService(callback) {
    // sql query statement
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.class;';
    // pool query
    pool.query(sql, (err, result) => {
      // error
>>>>>>> Stashed changes
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
<<<<<<< Updated upstream
      return callback(null, result);
      // pool.end()
=======

      return callback(null, result); // if
    });
  },

  // get all packages
  getAllPackage(callback) {
    // sql query statement
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.package;';
    // pool query
    pool.query(sql, (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate

      return callback(null, result); // if
    });
  },

  // get all rates
  getAllRates(callback) {
    // sql query statement
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.rates;';
    // pool query
    pool.query(sql, (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate

      return callback(null, result); // if
    });
  },

  // get all additional service
  getAllAdditionalService(callback) {
    // sql query statement
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.extraservice;';
    // pool query
    pool.query(sql, (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate

      return callback(null, result); // if
>>>>>>> Stashed changes
    });
  },
};

//= ======================================================
//              Exports
//= ======================================================
module.exports = Customer;
