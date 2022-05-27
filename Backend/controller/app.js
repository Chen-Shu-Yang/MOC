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

// module exports
module.exports = app;
