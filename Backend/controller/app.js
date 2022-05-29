/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */

//= ======================================================
//              Imports
//= ======================================================
const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const cors = require('cors');

const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');

// model

const Admin = require('../model/admin');

// MF function
/**
 * prints useful debugging information about an endpoint we are going to service
 *
 * @param {object} req
 *   request object
 *
 * @param {object} res
 *   response object
 *
 * @param {function} next
 *   reference to the next function to call
 */

//= ======================================================
//              MiddleWare Functions
//= ======================================================
function printDebugInfo(req, res, next) {
  console.log();
  console.log('-----------------[Debug Info]----------------');
  // console.log(`Servicing ${urlPattern} ..`);
  console.log(`Servicing ${req.url}..`);

  console.log(`> req.params:${JSON.stringify(req.params)}`);
  console.log(`> req.body:${JSON.stringify(req.body)}`);
  // console.log("> req.myOwnDebugInfo:" + JSON.stringify(req.myOwnDebugInfo));

  console.log('---------------[Debug Info Ends]----------------');
  console.log();

  next();
}

const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();

// MF Configurations
app.use(urlEncodedParser);
app.use(jsonParser);

app.options('*', cors());
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send('HelloWorld');
});

app.get('/classes', printDebugInfo, async (req, res) => {


  Admin.getAllClassOfService(function (err, result) {
    if (!err) {
      console.log("==================================")
      console.log("get class work")
      console.log("==================================")
      res.status(200).send(result);
    }
    else {
      res.status(500).send("Some error");
    }
  });



});


app.get('/classes/:id', printDebugInfo, async (req, res) => {
  var babyid = req.params.id;

  // try {
  Admin.getClass(babyid, function (err, result) {

    if (!err) {
      if (result.length == 0) {
        output = {
          "Error": "Id not found"
        };
        res.status(404).send(output);

      }
      else {
        res.status(200).send(result);

      }


    }
    else {
      output = {
        "Error": "Internal sever issues"
      };
      res.status(500).send(output);

    }





  });





});


// add baby detail
app.post('/class', printDebugInfo, function (req, res) {
  var ClassName = req.body.ClassName;
  var ClassPricing = req.body.ClassPricing;
  var ClassDes = req.body.ClassDes;






  Admin.addClass(ClassName, ClassPricing, ClassDes, function (err, result) {

   console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
   console.log("IN the app.js")
   console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

    // if (typeof ClassPricing == 'number') {
      if (!err) {

        res.status(201).send(result)
      }
      else {

        if (err.code === "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD") {
          res.status(406).send("Inappropriate value")

        }

        else if (err.code === "ER_BAD_NULL_ERROR") {
          res.status(400).send("Null value not allowed")

        }
        else {
          res.status(500).send("Internal Server Error")

        }

      }
    // } else {
    //   res.status(406).send("Inappropriate value");
    // }
  });
}

);



// update baby details
app.put('/class/:id', printDebugInfo, function (req, res) {
  var classID = req.params.id;
  var ClassName = req.body.ClassName;
  var ClassPricing = req.body.ClassPricing;
  var ClassDes = req.body.ClassDes;



  Admin.updateClass(ClassName, ClassPricing, ClassDes, classID, function (err, result) {

   
    // if (typeof ClassPricing == 'number') {
      if (!err) {
        var output = {
          "classID": result.insertId
        }

        console.log("result comd" + output.classID)


        res.status(201).send(result);

      }
      else {
        if (err.code == "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD") {
          res.status(406).send("Inappropriate value")

        }

        else if (err.code == "ER_BAD_NULL_ERROR") {
          res.status(400).send("Null value not allowed")

        }
        else {
          res.status(500).send("Internal Server Error")

        }

      }

    // }
    // else {
    //   res.status(406).send("Inappropriate value")

    // }

  });




});

// delete baby
app.delete('/class/:id', printDebugInfo, function (req, res) {
  var id = req.params.id;


  Admin.deleteClass(id, function (err, result) {

      if (!err) {

          if (result.affectedRows == 0) {

              res.status(404).send("Item cannot be deleted");
              

          }
          else {
              res.status(200).send(result);

          }



      }
      else {
          output = {
              "Error": "Internal sever issues"
          };
          res.status(500).send(output);
      }



  });





});







// module exports
module.exports = app;
