/* eslint-disable max-len */
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
  updateEmployee(EmployeeName, EmployeeDes, EmployeeImgageCloudinaryFileId, EmployeeImgUrl, EmployeeSkills, id, callback) {
    // sql query statement
    const sql = `
      UPDATE 
        heroku_6b49aedb7855c0b.employee
      SET
        EmployeeName=?,
        EmployeeDes=?,
        EmployeeImgageCloudinaryFileId=?,
        EmployeeImgUrl=?,
        Skillsets=?
      WHERE
        EmployeeID=?;
    `;
    // pool query
    pool.query(sql, [EmployeeName, EmployeeDes, EmployeeImgageCloudinaryFileId, EmployeeImgUrl, EmployeeSkills, id], (err, result) => {
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

    const values = [id];
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

};

//= ======================================================
//              Exports
//= ======================================================
module.exports = Admin;
