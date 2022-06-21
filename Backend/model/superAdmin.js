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
// intialising pool
const pool = require('../controller/databaseConfig');

//= ======================================================
//              Functions / Objects
//= ======================================================
const superAdmin = {

  //= ======================================================
  //              Features / Class
  //= ======================================================
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
  //= ======================================================
  //              Features / Employee
  //= ======================================================
  // to limit and offset employee
  pageEmployee(pageNumber, callback) {
    // the page number clicked
    // eslint-disable-next-line radix
    pageNumber = parseInt(pageNumber);
    // Number of employee showed per page
    const limitPerPage = 6;
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
  updateEmployee(EmployeeName, EmployeeDes, EmployeeImageCloudinaryFileId, EmployeeImgUrl, EmployeeSkills, id, callback) {
    // sql query statement
    const sql = `
      UPDATE 
        heroku_6b49aedb7855c0b.employee
      SET
        EmployeeName=?,
        EmployeeDes=?,
        EmployeeImageCloudinaryFileId=?,
        EmployeeImgUrl=?,
        Skillsets=?
      WHERE
        EmployeeID=?;
    `;
    // pool query
    pool.query(sql, [EmployeeName, EmployeeDes, EmployeeImageCloudinaryFileId, EmployeeImgUrl, EmployeeSkills, id], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },
  // feature/addEmployee Model
  // eslint-disable-next-line max-len
  addEmployee(EmployeeName, EmployeeDes, EmployeeImgageCloudinaryFileId, EmployeeImageUrl, Skillsets, callback) {
    // sql statemetn to insert new employee
    const sql = 'INSERT INTO heroku_6b49aedb7855c0b.employee (EmployeeName, EmployeeDes, EmployeeImageCloudinaryFileId, EmployeeImgUrl, Skillsets) VALUES (?,?,?,?,?);';
    // pool query
    pool.query(sql, [EmployeeName, EmployeeDes, EmployeeImgageCloudinaryFileId, EmployeeImageUrl, Skillsets], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result); // if
    });
  },

  // delete all class of services
  deleteEmployee(id, callback) {
    console.log(` admin.js employee delete method start ${id}`);
    // sql query statement
    const sql = 'DELETE FROM heroku_6b49aedb7855c0b.employee where EmployeeID =?;';

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

  //= ======================================================
  //              Features / Booking
  //= ======================================================

  // get all booking
  getAllBooking(callback) {
    // sql query statement
    const sql = `
    SELECT
    b.BookingID,b.Admin,DATE_ADD(b.ScheduleDate, INTERVAL 1 DAY) ScheduleDate,b.Contract,cu.FirstName,cu.LastName,e.EmployeeName,b.Status,p.PackageName,cl.ClassName,c.StartDate,c.TimeOfService,c.NoOfBathrooms,c.NoOfRooms,c.Rate,c.EstimatedPricing,c.Address
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

  //= ======================================================
  //              Features / auto booking
  //= ======================================================

  // get all booking that are valid for auto booking
  getAutoBookingValidContracts(callback) {
    // sql query statement that select contracts and corresponding users that are active the c represets contract table and cu represents customer table in heroku_6b49aedb7855c0b database
    const sql = `
    Select c.ContractID,c.Customer,c.DayOfService,c.DayOfService2,c.Package from heroku_6b49aedb7855c0b.contract c
    inner join heroku_6b49aedb7855c0b.customer cu on cu.CustomerID=c.Customer 
    where c.contractStatus='active' and cu.Status='active';
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

  // add booking
  addBooking(ContractId, ScheduleDate, callback) {
    // sql query statement to add booking to database
    const sql = `
    INSERT INTO
    heroku_6b49aedb7855c0b.booking (
ContractId,
ScheduleDate)
VALUES
(
?,
?
);
`;
    // pool query
    pool.query(sql, [ContractId, ScheduleDate], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate

      return callback(null, result);

      // pool.end()
    });
  },

};

//= ======================================================
//              Exports
//= ======================================================
module.exports = superAdmin;
