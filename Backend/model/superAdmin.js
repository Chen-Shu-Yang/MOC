/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
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

  //= ======================================================
  //              Features / Employee
  //= ======================================================

  // get all Admins and Super admins
  getAllAdmins(callback) {
    // sql query statement
    const sql = `
      SELECT 
        AdminID, FirstName, LastName, Email, AdminType 
      FROM 
        heroku_6b49aedb7855c0b.admin
      UNION SELECT 
        SuperAdminID, FirstName, LastName, Email, AdminType 
      FROM 
        heroku_6b49aedb7855c0b.superadmin;
    `;
    // pool query
    pool.query(sql, (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },

  // get regular admin by id
  getAdmin(id, callback) {
    // sql query statement
    const sql = 'SELECT AdminID, FirstName, LastName, Password, Email, AdminType FROM heroku_6b49aedb7855c0b.admin where AdminID=?;';

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

  // get super admin by id
  getSuperAdmin(id, callback) {
    // sql query statement
    const sql = `
      SELECT 
        SuperAdminID, FirstName, LastName, Email, Password, AdminType 
      FROM 
        heroku_6b49aedb7855c0b.superadmin 
      WHERE 
        SuperAdminID=?;`;

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

  // add a regular admin
  addAdmin(firstName, lastName, pwd, email, type, callback) {
    // sql query statement
    const sql = `
      INSERT INTO
        heroku_6b49aedb7855c0b.admin (
          FirstName,
          LastName, 
          Password,
          Email,
          AdminType)
        VALUES 
        (?, ?, ?, ?, ?);
    `;
    // pool query
    pool.query(sql, [firstName, lastName, pwd, email, type], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
      // pool.end()
    });
  },

  // add a super admin
  addSuperAdmin(firstName, lastName, pwd, email, type, callback) {
    // sql query statement
    const sql = `
      INSERT INTO
        heroku_6b49aedb7855c0b.superadmin (
          FirstName,
          LastName, 
          Password,
          Email,
          AdminType)
        VALUES 
        (?, ?, ?, ?, ?);
    `;
    // pool query
    pool.query(sql, [firstName, lastName, pwd, email, type], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
      // pool.end()
    });
  },

  // update a regular admin
  updateAdmin(password, id, callback) {
    // sql query statement
    const sql = `
      UPDATE 
        heroku_6b49aedb7855c0b.admin
      SET
        Password=?
      WHERE
        AdminID=?;
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

  // update a super admin
  updateSuperAdmin(password, id, callback) {
    // sql query statement
    const sql = `
      UPDATE 
        heroku_6b49aedb7855c0b.superadmin
      SET
        Password=?
      WHERE
        SuperAdminID=?;
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

  // delete a regular admin
  deleteAdmin(id, callback) {
    // sql query statement
    const sql = 'DELETE FROM heroku_6b49aedb7855c0b.admin where AdminID =?;';

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

  // delete a super admin
  deleteSuperAdmin(id, callback) {
    // sql query statement
    const sql = 'DELETE FROM heroku_6b49aedb7855c0b.superadmin where SuperAdminID =?;';

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
