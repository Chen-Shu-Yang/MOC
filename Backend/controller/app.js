/* eslint-disable linebreak-style */
/* eslint-disable brace-style */
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

// const { JsonDB } = require('node-json-db');
// const { Config } = require('node-json-db/dist/lib/JsonDBConfig');

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

// get all class of service
app.get('/classes', printDebugInfo, async (req, res) => {
  // calling getAllClassOfService method from admin model
  Admin.getAllClassOfService((err, result) => {
    if (!err) {
      console.log('==================================');
      console.log('get class work');
      console.log('==================================');
      res.status(200).send(result);
    } else {
      res.status(500).send('Some error');
    }
  });
});

// get a class of sevice
app.get('/classes/:id', printDebugInfo, async (req, res) => {
  // extract id from params
  const classid = req.params.id;

  // calling getClass method from admin model
  Admin.getClass(classid, (err, result) => {
    if (!err) {
      // if id not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        res.status(200).send(result);
      }
    } else {
      // sending output as error message if there is any server issues
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// add a class
app.post('/class', printDebugInfo, (req, res) => {
  // extract all details needed
  const { ClassName } = req.body;
  const { ClassPricing } = req.body;
  const { ClassDes } = req.body;

  // check if class pricing is float value and execute code
  if (Number.parseFloat(ClassPricing)) {
    // calling addClass method from admin model
    Admin.addClass(ClassName, ClassPricing, ClassDes, (err, result) => {
      // if no error send results as positive
      if (!err) {
        res.status(201).send(result);
      }
      // eslint-disable-next-line max-len
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD send error response as inappropriate value
      else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        res.status(406).send('Inappropriate value');
      }
      // if err.code === ER_BAD_NULL_ERROR send error response as Null value not allowed
      else if (err.code === 'ER_BAD_NULL_ERROR') {
        res.status(400).send('Null value not allowed');
      }
      // if server issues send this as an error
      else {
        res.status(500).send('Internal Server Error');
      }
    });
  // eslint-disable-next-line brace-style
  }
  // if class pricing is not float
  else {
    res.status(400).send('Null value not allowed');
  }
});

// update class of service
app.put('/class/:id', printDebugInfo, (req, res) => {
  // extract id from params
  const classID = req.params.id;
  // extract all details needed
  const { ClassName } = req.body;
  const { ClassPricing } = req.body;
  const { ClassDes } = req.body;

  // check if class pricing is float value and execute code
  if (Number.parseFloat(ClassPricing)) {
    // calling updateClass method from admin model
    Admin.updateClass(ClassName, ClassPricing, ClassDes, classID, (err, result) => {
      // if there is no errorsend the following as result
      if (!err) {
        const output = {
          classID: result.insertId,
        };

        console.log(`result ${output.classID}`);

        res.status(201).send(result);
      }
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      // send Inappropriate value as return message
      else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        res.status(406).send('Inappropriate value');
      }
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      else if (err.code === 'ER_BAD_NULL_ERROR') {
        res.status(400).send('Null value not allowed');
      }
      // else if there is a server error return message
      else {
        res.status(500).send('Internal Server Error');
      }
    });
  }
  // if class pricing is not float
  else {
    res.status(406).send('Inappropriate value');
  }
});

// delete class of service
app.delete('/class/:id', printDebugInfo, (req, res) => {
  // extract id from params
  const { id } = req.params;
  // calling deleteClass method from admin model
  Admin.deleteClass(id, (err, result) => {
    if (!err) {
      // result.affectedRows indicates that id to be deleted
      // cannot be found hence send as error message
      if (result.affectedRows === 0) {
        res.status(404).send('Item cannot be deleted');
      }
      // else a postitve result
      else {
        res.status(200).send(result);
      }
    } else
    // sever error
    {
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// get employee per page
app.get('/employee/:pageNumber', printDebugInfo, async (req, res) => {
  // extract pageNumber from params to determine the page we are at
  const { pageNumber } = req.params;

  // calling pageEmployee method from admin model
  Admin.pageEmployee(pageNumber, (err, result) => {
    // if no error send result
    if (!err) {
      res.status(200).send(result);
    }
    // if error send error message
    else {
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// get all employee
app.get('/employee', printDebugInfo, async (req, res) => {
  // calling getAllClassOfService method from admin model
  Admin.getAllEmployee((err, result) => {
    // if no error send result
    if (!err) {
      console.log('==================================');
      console.log('get class work');
      console.log('==================================');
      res.status(200).send(result);
    }
    // if error send error message
    else {
      res.status(500).send('Some error');
    }
  });
});

// get an employee
app.get('/oneemployee/:id', printDebugInfo, async (req, res) => {
  // extract id from params
  const employeeId = req.params.id;

  // calling getClass method from admin model
  Admin.getEmployee(employeeId, (err, result) => {
    if (!err) {
      // if id not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        res.status(200).send(result);
      }
    } else {
      // sending output as error message if there is any server issues
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// update employee
app.put('/employees/:id', printDebugInfo, (req, res) => {
  // extract id from params
  const EmployeeID = req.params.id;
  // extract all details needed
  const { EmployeeName } = req.body;
  const { EmployeeDes } = req.body;
  const { EmployeeSkills } = req.body;
  const { EmployeeImg } = req.body;

  // calling updateClass method from admin model
  Admin.updateEmployee(
    EmployeeName,
    EmployeeSkills,
    EmployeeImg,
    EmployeeDes,
    EmployeeID,
    (err, result) => {
    // if there is no errorsend the following as result
      if (!err) {
        const output = {
          classID: result.insertId,
        };

        console.log(`result ${output.classID}`);

        res.status(201).send(result);
      }
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD send
      // Inappropriate value as return message
      else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        res.status(406).send('Inappropriate value');
      }
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      else if (err.code === 'ER_BAD_NULL_ERROR') {
        res.status(400).send('Null value not allowed');
      }
      // else if there is a server error return message
      else {
        res.status(500).send('Internal Server Error');
      }
    },
  );
});

//= ======================================================
//              Features / Booking
//= ======================================================

// get employee per page
app.get('/booking/:pageNumber', printDebugInfo, async (req, res) => {
  // extract pageNumber from params to determine the page we are at
  const { pageNumber } = req.params;

  // calling pageEmployee method from admin model
  Admin.pageBooking(pageNumber, (err, result) => {
    // if no error send result
    if (!err) {
      res.status(200).send(result);
    }
    // if error send error message
    else {
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// get all employee
app.get('/booking', printDebugInfo, async (req, res) => {
  // calling getAllClassOfService method from admin model
  Admin.getAllBooking((err, result) => {
    // if no error send result
    if (!err) {
      console.log('==================================');
      console.log('Bihh');
      console.log('==================================');
      res.status(200).send(result);
    }
    // if error send error message
    else {
      res.status(500).send('Some error');
    }
  });
});

// add a booking
app.post('/booking', printDebugInfo, (req, res) => {
  // extract all details needed
  const { bookingID } = req.body;
  const { bookingDate } = req.body;

  Admin.addBooking(bookingID, bookingDate, (err, result) => {
    if (!err) {
      res.status(201).send(result);
    }
    else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      res.status(406).send('Inappropriate value');
    }
    else if (err.code === 'ER_BAD_NULL_ERROR') {
      res.status(400).send('Null value not allowed');
    }
    else {
      res.status(500).send('Internal Server Error');
    }
  });
});

// update class of service
app.put('/booking/:bookingID', printDebugInfo, (req, res) => {
  // extract id from params
  const bookingID = req.params.id;
  // extract all details needed
  const { scheduleDate } = req.body;

  // check if class pricing is float value and execute code

  // calling updateClass method from admin model
  Admin.updateBooking(scheduleDate, bookingID, (err, result) => {
    // if there is no errorsend the following as result
    if (!err) {
      const output = {
        bookingID: result.insertId,
      };
      console.log(`result ${output.bookingID}`);
      res.status(201).send(result);
    }
    // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
    // send Inappropriate value as return message
    else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      res.status(406).send('Inappropriate value');
    }
    // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
    else if (err.code === 'ER_BAD_NULL_ERROR') {
      res.status(400).send('Null value not allowed');
    }
    // else if there is a server error return message
    else {
      res.status(500).send('Internal Server Error');
    }
  });
});

// module exports
module.exports = app;
