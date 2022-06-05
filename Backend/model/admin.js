/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
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
const Admin = {

  // get all class of services
  getAllClassOfService(callback) {
    // sql query statement
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.class ;';
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
  // get class of service by id
  getClass(id, callback) {
    // sql query statement
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.class where ClassID=?;';

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

  // add class of services
  addClass(ClassName, ClassPricing, ClassDes, callback) {
    // sql query statement
    const sql = `


        INSERT INTO
               heroku_6b49aedb7855c0b.class (
           ClassName,
           ClassPricing, 
          ClassDes)
        VALUES
        (
        ?,
        ?,
      ?
        );
`;
    // pool query
    pool.query(sql, [ClassName, ClassPricing, ClassDes], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate

      return callback(null, result);

      // pool.end()
    });
  },
  // update all class of services
  updateClass(ClassName, ClassPricing, ClassDes, id, callback) {
    // sql query statement
    const sql = `
            UPDATE 
            heroku_6b49aedb7855c0b.class
         SET
            ClassName=?,
            ClassPricing=?,
            ClassDes=?
        where
             ClassID=?
             ;
            

            `;
    // pool query
    pool.query(sql, [ClassName, ClassPricing, ClassDes, id], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },
  // delete all class of services
  deleteClass(id, callback) {
    // sql query statement
    const sql = 'DELETE FROM heroku_6b49aedb7855c0b.class where ClassID =?;';

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
  // to limit and offset employee
  pageEmployee(pageNumber, callback) {
    // eslint-disable-next-line no-param-reassign
    // eslint-disable-next-line radix

    // the page number clicked
    // eslint-disable-next-line radix
    pageNumber = parseInt(pageNumber);
    // eslint-disable-next-line no-undef

    // Number of employee showed per page
    const limitPerPage = 6;
    // eslint-disable-next-line max-len
    // Number of employee to skip based on the page number so that previously shown data will not be displayed
    const numberOfValueToSkip = (pageNumber - 1) * 6;

    // sql statement to limit and skip
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.employee LIMIT ? OFFSET ?;';
    // values to pass for the query number of employee per page and number of employee to skip
    const values = [limitPerPage, numberOfValueToSkip];
    // query
    pool.query(sql, values, (err, result) => {
      // if error send error message
      if (err) {
        console.log(err);
        return callback(err);
      }
      // else send result
      return callback(null, result);
    });
  },
  // get all Employee
  getAllEmployee(callback) {
    // sql query statement
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.employee;';
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

  // get class of service by id
  getEmployee(id, callback) {
    // sql query statement
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.employee where EmployeeID=?;';

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

  // update all class of services
  updateEmployee(EmployeeName, EmployeeSkills, EmployeeImg, EmployeeDes, id, callback) {
    // sql query statement
    const sql = `
      UPDATE 
        heroku_6b49aedb7855c0b.employee
      SET
        EmployeeName=?,
        EmployeeDes=?,
        EmployeeImg=?,
        Skillsets=?
      WHERE
        EmployeeID=?;
    `;
    // pool query
    pool.query(sql, [EmployeeName, EmployeeDes, EmployeeImg, EmployeeSkills, id], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },

  //= ======================================================
  //              Features / Booking
  //= ======================================================

  // get all booking
  getAllBooking(callback) {
    // sql query statement
    const sql = `
    SELECT
    b.BookingID,b.Admin,b.ScheduleDate,b.Contract,cu.FirstName,cu.LastName,e.EmployeeName,b.Status,p.PackageName,cl.ClassName,c.StartDate,c.TimeOfService,c.NoOfBathrooms,c.NoOfRooms,c.Rate,c.EstimatedPricing,c.Address
    FROM
    heroku_6b49aedb7855c0b.booking b
    join heroku_6b49aedb7855c0b.contract c on b.Contract = c.ContractID
    join heroku_6b49aedb7855c0b.customer cu on c.Customer = cu.CustomerID
    join heroku_6b49aedb7855c0b.package p on c.Package = p.PackageID
    left join heroku_6b49aedb7855c0b.employee e on b.Employee = e.EmployeeID
    join heroku_6b49aedb7855c0b.class cl on c.Class = cl.ClassID
    `;
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

  // to limit and offset booking
  pageBooking(pageNumber, callback) {
    // the page number clicked
    pageNumber = parseInt(pageNumber, 10);
    // Number of employee showed per page
    const limitPerPage = 6;
    // Prevent displaying repetitive information
    const numberOfValueToSkip = (pageNumber - 1) * 6;

    // sql statement to limit and skip
    const sql = `
    SELECT
    b.BookingID,b.Admin,b.ScheduleDate,b.Contract,cu.FirstName,cu.LastName,e.EmployeeName,b.Status,p.PackageName,cl.ClassName,c.StartDate,c.TimeOfService,c.NoOfBathrooms,c.NoOfRooms,c.Rate,c.EstimatedPricing,c.Address
    FROM
    heroku_6b49aedb7855c0b.booking b
    join heroku_6b49aedb7855c0b.contract c on b.Contract = c.ContractID
    join heroku_6b49aedb7855c0b.customer cu on c.Customer = cu.CustomerID
    join heroku_6b49aedb7855c0b.package p on c.Package = p.PackageID
    left join heroku_6b49aedb7855c0b.employee e on b.Employee = e.EmployeeID
    join heroku_6b49aedb7855c0b.class cl on c.Class = cl.ClassID LIMIT ? OFFSET ?;
  
    `;
    // values to pass for the query number of employee per page and number of employee to skip
    const values = [limitPerPage, numberOfValueToSkip];
    // query
    pool.query(sql, values, (err, result) => {
    // if error send error message
      if (err) {
        console.log(err);
        return callback(err);
      }
      // else send result
      return callback(null, result);
    });
  },

  // add booking of services
  addBooking(Contract, ScheduleDate, Admin, callback) {
    // sql query statement
    const sql = `


    INSERT INTO
    heroku_6b49aedb7855c0b.booking (
    Contract,
    ScheduleDate, 
    Status,
    Admin)
    VALUES
    (?,?,'Pending',?);
`;
    // pool query
    pool.query(sql, [Contract, ScheduleDate, Admin], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate

      return callback(null, result);

      // pool.end()
    });
  },

  // update all booking of services
  updateBooking(ScheduleDate, BookingID, callback) {
    // sql query statement
    const sql = `
          UPDATE 
            heroku_6b49aedb7855c0b.booking 
          SET
            ScheduleDate=?,
          WHERE
            BookingID=?
               ;  
              `;
      // pool query
    pool.query(sql, [ScheduleDate, BookingID], (err, result) => {
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
module.exports = Admin;
