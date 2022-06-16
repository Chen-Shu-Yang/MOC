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
  // Get all customer bookings
  getBookingDetails(id, callback) {
    // sql query statement
    const sql = 'SELECT b.BookingID,DATE_FORMAT(b.ScheduleDate,\'%Y-%m-%d\') as ScheduleDate,p.PackageName,cl.ClassName,c.DayOfService,c.DayOfService2,c.Address,c.NoOfRooms,c.NoOfBathrooms,c.EstimatedPricing,c.ExtraNotes,r.RateName,e.EmployeeName,b.Status FROM heroku_6b49aedb7855c0b.booking as b join heroku_6b49aedb7855c0b.contract as c on b.ContractID = c.ContractID join heroku_6b49aedb7855c0b.customer as cu on c.Customer = cu.CustomerID join heroku_6b49aedb7855c0b.rates as r on c.Rate = r.RatesID left join heroku_6b49aedb7855c0b.employee as e on b.Employee = e.EmployeeID join heroku_6b49aedb7855c0b.class as cl on c.Class = cl.ClassID join heroku_6b49aedb7855c0b.package as p on c.Package = p.PackageID where cu.CustomerID = ?;';

    const values = [id];
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
  updateBookingStatus(id, callback) {
    // sql query statement
    const sql = `
            UPDATE 
            heroku_6b49aedb7855c0b.booking
         SET
           Status='Cancelled'
        where
            BookingID=?
             ;
            `;
    // pool query
    pool.query(sql, [id], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },

  getABookingById(id, callback) {
    // sql query statement
    const sql = ` Select b.BookingID,b.Status,b.ScheduleDate ,b.ContractId,c.TimeOfService 
    from heroku_6b49aedb7855c0b.booking b
    inner join heroku_6b49aedb7855c0b.contract c 
    on b.ContractId=c.ContractID where b.BookingID=?;`;

    // pool query
    pool.query(sql, [id], (err, result) => {
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

      return callback(null, result);
    });
  },

};

//= ======================================================
//              Exports
//= ======================================================
module.exports = Customer;
