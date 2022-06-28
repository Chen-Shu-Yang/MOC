/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
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
             ClassID=?;
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
    // Number of employee to skip based on the page number so that
    // previously shown data will not be displayed
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

  // get employee by id
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

  // update employee
  updateEmployee(
    EmployeeName,
    EmployeeDes,
    EmployeeImageCloudinaryFileId,
    EmployeeImgUrl,
    EmployeeSkills,
    id,
    callback,
  ) {
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
    pool.query(sql, [
      EmployeeName,
      EmployeeDes,
      EmployeeImageCloudinaryFileId,
      EmployeeImgUrl,
      EmployeeSkills,
      id,
    ], (err, result) => {
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
  addEmployee(
    EmployeeName,
    EmployeeDes,
    EmployeeImgageCloudinaryFileId,
    EmployeeImageUrl,
    Skillsets,
    callback,
  ) {
    // sql statement to insert new employee
    const sql = 'INSERT INTO heroku_6b49aedb7855c0b.employee (EmployeeName, EmployeeDes, EmployeeImageCloudinaryFileId, EmployeeImgUrl, Skillsets) VALUES (?,?,?,?,?);';
    // pool query
    pool.query(sql, [
      EmployeeName,
      EmployeeDes,
      EmployeeImgageCloudinaryFileId,
      EmployeeImageUrl,
      Skillsets,
    ], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result); // if
    });
  },

  // delete employee
  deleteEmployee(id, callback) {
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
    b.BookingID,b.Admin,DATE_ADD(b.ScheduleDate, INTERVAL 1 DAY) ScheduleDate,b.ContractID,cu.FirstName,cu.LastName,e.EmployeeName,b.Status,p.PackageName,cl.ClassName,c.StartDate,c.TimeOfService,c.NoOfBathrooms,c.NoOfRooms,c.Rate,c.EstimatedPricing,c.Address
    FROM
    heroku_6b49aedb7855c0b.booking b
    join heroku_6b49aedb7855c0b.contract c on b.ContractId = c.ContractId
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

  // get class of service by id
  getBooking(id, callback) {
    // sql query statement
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.booking where BookingID=?;';

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
    b.BookingID,b.Admin,DATE_ADD(b.ScheduleDate, INTERVAL 1 DAY) ScheduleDate,b.ContractID,cu.FirstName,cu.LastName,e.EmployeeName,b.Status,p.PackageName,cl.ClassName,c.StartDate,c.TimeOfService,c.NoOfBathrooms,c.NoOfRooms,c.Rate,c.EstimatedPricing,c.Address
    FROM
    heroku_6b49aedb7855c0b.booking b
    join heroku_6b49aedb7855c0b.contract c on b.ContractId = c.ContractId
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
  addOneBooking(Contract, ScheduleDate, AdminID, callback) {
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
    pool.query(sql, [Contract, ScheduleDate, AdminID], (err, result) => {
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
          UPDATE heroku_6b49aedb7855c0b.booking SET ScheduleDate= ? WHERE BookingID= ?;  
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

  // get all booking with the status of Assigned and Pending
  getAllBookingCancel(callback) {
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
        join heroku_6b49aedb7855c0b.class cl on c.Class = cl.ClassID where b.Status='Assigned' or b.Status='Pending'
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
  pageBookingCancel(pageNumber, callback) {
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
      join heroku_6b49aedb7855c0b.class cl on c.Class = cl.ClassID where b.Status='Assigned' or b.Status='Pending'  LIMIT ? OFFSET ?;
    
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

  // cancel admin booking
  cancelBookingAdmin(bookingId, callback) {
    // sql query statement

    const sql = `
              UPDATE 
              heroku_6b49aedb7855c0b.booking
           SET
              Status="Cancelled"
            
          where
               BookingID=?
               ;
              `;
    // pool query
    pool.query(sql, [bookingId], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },

  // ---------------------------------------------------
  //                 Feature/adminCustomer
  // ---------------------------------------------------
  // get available employee for scheduling
  getAvailableEmployee(date, callback) {
    // sql query statement
    const sql = `
      SELECT DISTINCT
        e.EmployeeID, e.EmployeeName, e.EmployeeDes, e.EmployeeImgUrl, e.EmployeeImageCloudinaryFileId
      FROM 
        heroku_6b49aedb7855c0b.employee AS e
      LEFT JOIN 
        heroku_6b49aedb7855c0b.schedule AS s 
      ON 
        s.Employee = e.EmployeeID 
      WHERE
        ScheduleDate IS NULL OR ScheduleDate != ? 
      AND 
        Employee NOT IN (SELECT s.Employee FROM heroku_6b49aedb7855c0b.schedule s WHERE ScheduleDate = ?);
      `;

    const values = [date, date];
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

  // add employee availability
  addEmployeeAvailability(employeeId, date, time, callback) {
    // sql query statement
    const sql = `
      INSERT INTO
        heroku_6b49aedb7855c0b.schedule (
          ScheduleDate,
          TimeSlot, 
          Employee)
      VALUES
        (?,?,?);
    `;
    // pool query
    pool.query(sql, [date, time, employeeId], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
      // pool.end()
    });
  },
  // get all Customer
  getAllCustomer(callback) {
    // sql query statement
    const sql = 'SELECT CustomerID, FirstName, LastName, Email, Password, Status FROM heroku_6b49aedb7855c0b.customer;';
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

  // get one Customer by id
  getCustomer(id, callback) {
    // sql query statement
    const sql = 'SELECT CustomerID, FirstName, LastName, Password, Status FROM heroku_6b49aedb7855c0b.customer WHERE CustomerID=?;';

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

  // delete customer
  deleteCustomer(id, callback) {
    console.log(` admin.js customer delete method start ${id}`);
    // sql query statement
    const sql = 'DELETE FROM heroku_6b49aedb7855c0b.customer where CustomerID =?;';

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

  // update customer
  updateCustomer(CustomerPassword, CustomerStatus, id, callback) {
    // sql query statement
    const sql = `
    UPDATE 
      heroku_6b49aedb7855c0b.customer
    SET
      Password=?,
      Status=?
    WHERE
      CustomerID=?;
  `;
    // pool query
    pool.query(sql, [CustomerPassword, CustomerStatus, id], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },

  // ---------------------------------------------------
  //                 Feature/rates
  // ---------------------------------------------------

  // get all rates
  getAllRates(callback) {
    // sql query statement
    const sql = 'SELECT rates.RatesID, rates.RateName, rates.RatePrice, package.PackageName FROM heroku_6b49aedb7855c0b.rates AS rates INNER JOIN heroku_6b49aedb7855c0b.package AS package ON rates.Package = package.PackageID;';
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

  // get rate by id
  getRate(id, callback) {
    // sql query statement
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.rates where RatesID=?;';

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

  // add new rate
  addRate(RateName, RatePrice, Package, callback) {
    // sql query statement
    const sql = `
        INSERT INTO
              heroku_6b49aedb7855c0b.rates (
                RateName,
                RatePrice,
                Package)
        VALUES
        (
        ?,
        ?,
        ?
        );
`;
    // pool query
    pool.query(sql, [RateName, RatePrice, Package], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate

      return callback(null, result);

      // pool.end()
    });
  },

  // update existing rate
  updateRate(RateName, RatePrice, Package, id, callback) {
    // sql query statement
    const sql = `
            UPDATE 
            heroku_6b49aedb7855c0b.rates
         SET
            RateName=?,
            RatePrice=?,
            Package=?
        where
            RatesID=?
             ;
            `;
    // pool query
    pool.query(sql, [RateName, RatePrice, Package, id], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },

  // delete existing rate
  deleteRate(id, callback) {
    // sql query statement
    const sql = 'DELETE FROM heroku_6b49aedb7855c0b.rates where RatesID =?;';

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
  //              Features / ExtraServices
  //= ======================================================
  // get all extra services
  getAllExtraServices(callback) {
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
    });
  },

  // get extra service by id
  getExtraService(id, callback) {
    // sql query statement
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.extraservice where ExtraServiceID=?;';

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

  // add new extra service
  addExtraService(ExtraServiceName, ExtraServicePrice, callback) {
    // sql query statement
    const sql = `
      INSERT INTO
             heroku_6b49aedb7855c0b.extraservice (
              ExtraServiceName,
              ExtraServicePrice)
      VALUES
      (
      ?,
      ?
      );
`;
    // pool query
    pool.query(sql, [ExtraServiceName, ExtraServicePrice], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate

      return callback(null, result);

      // pool.end()
    });
  },

  // update existing extra service
  updateExtraService(ExtraServiceName, ExtraServicePrice, id, callback) {
    // sql query statement
    const sql = `
          UPDATE 
          heroku_6b49aedb7855c0b.extraservice
       SET
          ExtraServiceName=?,
          ExtraServicePrice=?
      where
          ExtraServiceID=?
           ;
          `;
    // pool query
    pool.query(sql, [ExtraServiceName, ExtraServicePrice, id], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },

  // delete existing extra service
  deleteExtraService(id, callback) {
    // sql query statement
    const sql = 'DELETE FROM heroku_6b49aedb7855c0b.extraservice where ExtraServiceID =?;';

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
  //              Features / Assign
  //= ======================================================
  getBookingDetails(id, callback) {
    // sql query statement
    const sql = `SELECT b.BookingID,DATE_FORMAT(b.ScheduleDate,'%Y-%m-%d') as ScheduleDate,c.Address,c.NoOfRooms,c.NoOfBathrooms,c.EstimatedPricing,c.ExtraNotes,cu.FirstName,cu.LastName,r.RateName,e.EmployeeName
    FROM heroku_6b49aedb7855c0b.booking as b
    join heroku_6b49aedb7855c0b.contract as c on b.Contract = c.ContractID
    join heroku_6b49aedb7855c0b.customer as cu on c.Customer = cu.CustomerID
    join heroku_6b49aedb7855c0b.rates as r on c.Rate = r.RatesID
    left join heroku_6b49aedb7855c0b.employee as e on b.Employee = e.EmployeeID
    where b.BookingID=?;`;

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
  getEmployeeAvailabilty(bookingDate, callback) {
    // sql query statement
    const sql = `SELECT e.EmployeeName,e.EmployeeDes,e.EmployeeImgUrl,DATE_FORMAT(s.ScheduleDate,'%Y-%m-%d') AS FormatScheduleDate,e.EmployeeID,b.*
    FROM heroku_6b49aedb7855c0b.employee as e
    left join heroku_6b49aedb7855c0b.schedule as s on e.EmployeeID = s.Employee
    left join heroku_6b49aedb7855c0b.booking as b on e.EmployeeID = b.Employee
    
    Having FormatScheduleDate= ?;`;

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
  assignBooking(EmployeeID, BookingID, callback) {
    // sql query statement
    console.log(`${EmployeeID + BookingID} suPPP`);
    const sql = `
          UPDATE heroku_6b49aedb7855c0b.booking SET Employee= ? WHERE BookingID= ?;  
              `;
    // pool query
    pool.query(sql, [EmployeeID, BookingID], (err, result) => {
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
  //              Features / Profile
  //= ======================================================
  //= ======================================================
  //              Features / adminDashboard
  //= ======================================================

  getAdminById(cID, callback) {
    // sql query statement
    const sql = 'SELECT FirstName, LastName, Email FROM heroku_6b49aedb7855c0b.admin WHERE AdminID = ?;';

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

  updateAdminProfile(firstName, lastName, email, id, callback) {
    // sql query statement
    const sql = `
            UPDATE 
            heroku_6b49aedb7855c0b.admin
         SET
            FirstName=?,
            LastName=?,
            Email=?
        where
            AdminID=?
             ;
            `;
    // pool query
    pool.query(sql, [firstName, lastName, email, id], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },

  checkAdminPassword(cID, currentPassword, callback) {
    // sql query statement
    const sql = 'SELECT AdminID FROM heroku_6b49aedb7855c0b.admin WHERE AdminID = ? AND Password = ?;';

    // pool query
    pool.query(sql, [cID, currentPassword], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      // any results?
      if (JSON.stringify(result[0].AdminID) !== cID) {
        // no results - callback with no err & results
        // console.log(typeof result[0].AdminID);
        // console.log(typeof cID);
        console.log('this is null');
        const error = {
          message: 'No result',
        };
        console.log(error);
        return callback(error, null);
      }
      // one result - returns result
      console.log(result);
      return callback(null, result);
    });
  },

  updateAdminPassword(password, id, callback) {
    // sql query statement
    const sql = `
            UPDATE 
            heroku_6b49aedb7855c0b.admin
         SET
            Password = ?
        where
            AdminID = ?
             ;
            `;
    // pool query
    pool.query(sql, [password, id], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },
  // get number of booking made by therir month
  getBookingByMonth(callback) {
  // sql query statement to get number of booking made by therir month
    const sql = ` select month(ScheduleDate) as month, count(ScheduleDate) as numberOfBooking, Status 
  from heroku_6b49aedb7855c0b.booking 
  WHERE     year(ScheduleDate) = year(curdate())  and Status='Completed'
  group by month(ScheduleDate);
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
  getRevenueOfTheMonth(callback) {
  // sql query statement to get revenue
    const sql = `
  select c.ContractID ,(c.EstimatedPricing * count(b.BookingID))
  as Revenue,count(b.BookingID) from heroku_6b49aedb7855c0b.contract 
  as c
   join heroku_6b49aedb7855c0b.booking as b
  on  c.ContractID=b.ContractId
  where (month(b.ScheduleDate) = month(CURRENT_DATE()) and year(b.ScheduleDate)=year(current_date())) and b.Status='Completed'
  group by c.ContractID
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
  getAllContracts(callback) {
    // sql query statement
    const sql = `
    select c.ContractId,c.StartDate,cu.FirstName,cu.LastName,p.PackageName,cl.ClassName,c.StartDate,c.TimeOfService,c.NoOfBathrooms,c.NoOfRooms,c.Rate,c.EstimatedPricing,c.Address
    FROM
    heroku_6b49aedb7855c0b.contract c
    join heroku_6b49aedb7855c0b.customer cu on c.Customer = cu.CustomerID
    join heroku_6b49aedb7855c0b.package p on c.Package = p.PackageID
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
  pageContract(pageNumber, callback) {
    // the page number from parameter
    pageNumber = parseInt(pageNumber, 10);
    // Number of Contract showed per page
    const limitPerPage = 6;
    // Prevent displaying repetitive information
    const numberOfValueToSkip = (pageNumber - 1) * 6;

    // sql statement to limit and skip
    const sql = `
    select c.ContractId,c.StartDate,cu.FirstName,cu.LastName,p.PackageName,cl.ClassName,r.RateName,c.StartDate,c.TimeOfService,c.NoOfBathrooms,c.NoOfRooms,c.Rate,c.EstimatedPricing,c.Address
    FROM
    heroku_6b49aedb7855c0b.contract c
    join heroku_6b49aedb7855c0b.customer cu on c.Customer = cu.CustomerID
    join heroku_6b49aedb7855c0b.package p on c.Package = p.PackageID
    join heroku_6b49aedb7855c0b.rates r on c.Rate = r.RatesID
    join heroku_6b49aedb7855c0b.class cl on c.Class = cl.ClassID LIMIT ? OFFSET ?;

  `;
    // values to pass for the query number of contract per page and number of contract to skip
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
  getCancellationAbnormailtyDetails(callback) {
    // sql query statement
    const sql = `
    SELECT distinct
    b.ContractId,c.Customer,cu.FirstName,cu.LastName
  FROM 
    heroku_6b49aedb7855c0b.booking as b 
      left join heroku_6b49aedb7855c0b.contract as c
  on c.ContractId =b.ContractId 
      left join heroku_6b49aedb7855c0b.customer as cu
  on c.Customer =cu.CustomerID 
  where b.Status="Cancelled"
   and Month(b.ScheduleDate)=Month(curdate()) ;
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
   // add new extra service
   insertCancelAbnormality(CustomerID, callback) {
    // sql query statement
    const sql = `
    INSERT INTO
    heroku_6b49aedb7855c0b.cancel_booking_abnormality (
     CustomerID
  )
VALUES
(
?
);
`;
    // pool query
    pool.query(sql, [CustomerID], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate

      return callback(null, result);

      // pool.end()
    });
  },
  getAllCancelAbnormalities(callback) {
    // sql query statement
    const sql = `
    SELECT * FROM heroku_6b49aedb7855c0b.cancel_booking_abnormality;

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

  getAContractByID(id, callback) {
    // sql query statement
    const sql = 'SELECT Customer FROM heroku_6b49aedb7855c0b.contract where ContractID=?;';

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
module.exports = Admin;
