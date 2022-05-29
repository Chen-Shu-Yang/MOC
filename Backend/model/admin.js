/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-console */

//= ======================================================
//              Imports
//= ======================================================
const pool = require('../controller/databaseConfig');

//= ======================================================
//              Functions / Objects
//= ======================================================
const Admin = {

  getAllClassOfService(callback) {
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.class ;';

    pool.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        return callback(err.null);
      }
      return callback(null, result);

      // pool.end()
    });
  },

  getClass(id, callback) {
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.class where ClassID=?;';

    const values = [id];

    pool.query(sql, values, (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      return callback(null, result);
    });
  },

  //  Assignment 2
  addClass(ClassName, ClassPricing, ClassDes, callback) {
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

    pool.query(sql, [ClassName, ClassPricing, ClassDes], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      console.log(`${ClassPricing} MODEL`);
      return callback(null, result);

      // pool.end()
    });
  },

  updateClass(ClassName, ClassPricing, ClassDes, id, callback) {
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

    pool.query(sql, [ClassName, ClassPricing, ClassDes, id], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      return callback(null, result);
    });
  },

  deleteClass(id, callback) {
    const sql = 'DELETE FROM heroku_6b49aedb7855c0b.class where ClassID =?;';

    const values = [id];

    pool.query(sql, values, (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      return callback(null, result);
    });
  },

};

//= ======================================================
//              Exports
//= ======================================================
module.exports = Admin;
