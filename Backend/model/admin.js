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

    

    getAllClassOfService: function (callback) {

        var sql = 'SELECT * FROM heroku_6b49aedb7855c0b.class ;';

        pool.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                       return callback(err.null);
            } else {
                return callback(null, result);
            }
             // pool.end()
            })
    },

    
    getClass: function (id, callback) {

        var sql="SELECT * FROM heroku_6b49aedb7855c0b.class where ClassID=?;"

        const values = [id]

        pool.query(sql,values,(err, result) => {
            if(err) {
                console.log(err);
                return callback(err);
            } else {
                return callback(null,result);
            }
        })


    },

    
    //  Assignment 2
    addClass: function (ClassName, ClassPricing, ClassDes, callback) {


   
        var sql = `


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


pool.query(sql,[ClassName, ClassPricing, ClassDes], (err, result) => {
    if (err) {
        console.log(err);
        return callback(err);
    } else {
        console.log(ClassPricing + " MODEL")
        return callback(null, result);
    }
     // pool.end()
    })




},

    

updateClass: function (ClassName, ClassPricing, ClassDes, id, callback) {

        
            var sql = `
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
   
   pool.query(sql,[ClassName, ClassPricing, ClassDes,id],(err, result) => {
       if(err) {
           console.log(err);
           return callback(err);
       } else {
           return callback(null,result);
       }
   })

     




     },

     

    deleteClass: function (id, callback) {



        var sql="DELETE FROM heroku_6b49aedb7855c0b.class where ClassID =?;"
        
                const values = [id]
        
                pool.query(sql,values,(err, result) => {
                    if(err) {
                        console.log(err);
                        return callback(err);
                    } else {
                        return callback(null,result);
                    }
                })
        
        
            },
    
    





};

//= ======================================================
//              Exports
//= ======================================================
module.exports = Admin;
