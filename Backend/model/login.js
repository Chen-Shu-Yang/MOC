/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
const jwt = require('jsonwebtoken');
//= ======================================================
//              Imports
//= ======================================================
// intialising pool
const pool = require('../controller/databaseConfig');
const config = require('../config');

//= ======================================================
//              Functions / Objects
//= ======================================================
const Login = {

  // sql query statement
  // get all class of services
  Verify(email, password, callback) {
    // sql query statement
    const sql = `SELECT *
    FROM heroku_6b49aedb7855c0b.admin 
    Where Email = ? and Password = ?`;
    // pool query
    pool.query(sql, [email, password], (err, result) => {
      // error
      // if (verified) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } if (result.length === 0) {
        // sql query statement
        const sql = `SELECT *
    FROM heroku_6b49aedb7855c0b.customer 
    Where Email = ? and Password = ?`;
        // pool query
        pool.query(sql, [email, password], (err, result) => {
          // error
          // if (verified) {
          if (err) {
            console.log(err);
            return callback(err, null);
          } if (result.length === 0) {
            console.log('Bih');

            // sql query statement
            const sql = `SELECT *
    FROM heroku_6b49aedb7855c0b.superadmin 
    Where Email = ? and Password = ?`;
            // pool query
            pool.query(sql, [email, password], (err, result) => {
              // error
              // if (verified) {
              if (err) {
                console.log(err);
                return callback(err, null);
              } if (result.length === 0) {
                return callback(null, null);
              }
              // there must only be 1 result here
              // since email is unique
              // confirm if we have the key
              console.log(`secret config key${config.key}`);
              console.log(result[0]);

              // generate the token
              const token = jwt.sign(
                {
                  // (1)Payload
                  SuperAdminID: result[0].SuperAdminID,
                },
                // (2) Secret Key
                config.key,
                // (3) Lifetime of a token
                {
                  // expires in 24 hrs
                  expiresIn: 86400,
                },
              );
              return callback(null, token, result[0]);
            });
          } else {
            // there must only be 1 result here
          // since email is unique
          // confirm if we have the key
            console.log(`secret config key${config.key}`);
            console.log(result[0]);

            // generate the token
            const token = jwt.sign(
              {
              // (1)Payload
                CustomerID: result[0].CustomerID,
              },
              // (2) Secret Key
              config.key,
              // (3) Lifetime of a token
              {
              // expires in 24 hrs
                expiresIn: 86400,
              },
            );
            return callback(null, token, result[0]);
          }
        });
      } else {
        // there must only be 1 result here
      // since email is unique
      // confirm if we have the key
        console.log(`secret config key${config.key}`);
        console.log(result[0]);

        // generate the token
        const token = jwt.sign(
          {
          // (1)Payload
            AdminID: result[0].AdminID,
          },
          // (2) Secret Key
          config.key,
          // (3) Lifetime of a token
          {
          // expires in 24 hrs
            expiresIn: 86400,
          },
        );
        return callback(null, token, result[0]);
      }
    });
  },

};

//= ======================================================
//              Exports
//= ======================================================
module.exports = Login;
