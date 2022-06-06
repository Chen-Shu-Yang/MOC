/* eslint-disable linebreak-style */
/* eslint-disable brace-style */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable block-scoped-var */
/* eslint-disable max-len */
/* eslint-disable vars-on-top */
/* eslint-disable no-undef */

//= ======================================================
//              Imports
//= ======================================================
const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const cors = require('cors');

const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');

// model

const Login = require('../model/login');
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

// get all Login
app.post('/login', printDebugInfo, async (req, res, next) => {
  const { email } = req.body;
  const { password } = req.body;

  Login.Verify(email, password, (err, token, result) => {
    if (err) {
      // matched with callback (err, null)
      console.log(err);
      res.status(500);
      res.send(err.statusCode);
      return next(err);
    }
    let msg;
    if (!result) {
      msg = {
        Error: 'Invalid login',
      };
      res.status(404).send(msg);
    } else {
      console.log(`Token: ${result}`);
      msg = {
        UserID: result.UserID,
        token,
        CustomerID: result.CustomerID,
        SuperAdminID: result.SuperAdminID,
      };
      res.status(200).send(msg);
    }
  });
});

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

//----------------------------------------------------
//                 Feature/deleteEmployee
//---------------------------------------------------

// delete employee
app.delete('/employee/:employeeId', printDebugInfo, (req, res) => {
  // extract id from params
  const { employeeId } = req.params;
  console.log(` app.js employee delete method start ${employeeId}`);
  let output1;

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
        output1 = {
          EmployeeId: result[0].EmployeeID,
          EmployeeImageCloudinaryFileId: result[0].EmployeeImageCloudinaryFileId,

        };

        res.status(200).send(output1);
      }
    } else {
      // sending output as error message if there is any server issues
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });

  // calling deleteClass method from admin model

  Admin.deleteEmployee(employeeId, (err, result1) => {
    if (!err) {
      console.log('DELETE EMPLOYEE STATEMENT');
      // result.affectedRows indicates that id to be deleted
      // cannot be found hence send as error message
      if (result1.affectedRows === 0) {
        res.status(404).send('Item cannot be deleted');
      }
      // // else a postitve result
      else {
        console.log(output1.EmployeeImageCloudinaryFileId);

        cloudinary.uploader.destroy(output1.EmployeeImageCloudinaryFileId);

        // res.send(result1);
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

//----------------------------------------------------
//                 Feature/updateEmployee
//---------------------------------------------------

// update employee
app.put('/employee/:employeeId', upload.single('image_edit'), printDebugInfo, async (req, res) => {
  // extract id from params
  const { employeeId } = req.params;
  console.log(` app.js employee update method start ${employeeId}`);

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
        output1 = {
          EmployeeId: result[0].EmployeeID,
          EmployeeImageCloudinaryFileId: result[0].EmployeeImageCloudinaryFileId,

        };
        cloudinary.uploader.destroy(output1.EmployeeImageCloudinaryFileId);

        console.log('previous pic deleted');
      }
    } else {
      // sending output as error message if there is any server issues
      const output = {
        Error: 'Internal sever issues',
      };
      console.log(output);
    }
  });

  try {
    // cloudinary image upload method to the folder employee
    const result = await cloudinary.uploader.upload(req.file.path, { folder: 'employee' });
    // eslint-disable-next-line prefer-const
    // eslint-disable-next-line spaced-comment
    //retrieve EmployeeName from body
    const EmployeeName = req.body.employeeName;
    // // eslint-disable-next-line no-var
    // retrieve EmployeeDes from body
    const EmployeeDes = req.body.employeeDes;
    // retrieve Skillsets from body
    const Skillsets = req.body.skillSet;
    // retrieve EmployeeImgageCloudinaryFileId from result.public_id from uploading cloudinary
    const EmployeeImgageCloudinaryFileId = result.public_id;
    // retrieve EmployeeImageUrl from result.secure_url from uploading cloudinary
    const EmployeeImageUrl = result.secure_url;
    // // eslint-disable-next-line no-shadow
    // invoking Admin.addEmployee
    // eslint-disable-next-line no-shadow
    // eslint-disable-next-line no-unused-vars
    Admin.updateEmployee(EmployeeName, EmployeeDes, EmployeeImgageCloudinaryFileId, EmployeeImageUrl, Skillsets, employeeId, (err, result) => {
      // if there is no error
      if (!err) {
        // eslint-disable-next-line no-var
        var output = 'done';
        return res.status(201).send(output);
      }
    });
  } catch (error) {
    output = {
      Error: 'Internal sever issues',
    };
    return res.status(500).send(output);
  }
});

//----------------------------------------------------
//                 Feature/addEmployee
//---------------------------------------------------

// upload.single method to upload an image with the key of image
app.post('/adddEmployee', upload.single('image'), async (req, res) => {
  try {
    // cloudinary image upload method to the folder employee
    const result = await cloudinary.uploader.upload(req.file.path, { folder: 'employee' });
    // retrieve EmployeeName from body
    const EmployeeName = req.body.employeeName;
    // retrieve EmployeeDes from body
    const EmployeeDes = req.body.employeeDes;
    // retrieve Skillsets from body
    const Skillsets = req.body.skillSet;
    // retrieve EmployeeImgageCloudinaryFileId from result.public_id from uploading cloudinary
    const EmployeeImgageCloudinaryFileId = result.public_id;
    // retrieve EmployeeImageUrl from result.secure_url from uploading cloudinary
    const EmployeeImageUrl = result.secure_url;
    // invoking Admin.addEmployee
    Admin.addEmployee(EmployeeName, EmployeeDes, EmployeeImgageCloudinaryFileId, EmployeeImageUrl, Skillsets, (err, result) => {
      // if there is no error
      if (!err) {
        const output = 'done';
        return res.status(201).send(output + result);
      }
    });
  } catch (error) {
    output = {
      Error: 'Internal sever issues',
    };
    return res.status(500).send(output);
  }
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
// get a class of sevice
app.get('/oneBooking/:id', printDebugInfo, async (req, res) => {
  // extract id from params
  const bookingID = req.params.id;

  // calling getClass method from admin model
  Admin.getBooking(bookingID, (err, result) => {
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

// add a booking
app.post('/booking', printDebugInfo, (req, res) => {
  // extract all details needed
  const { bookingID } = req.body;
  const { bookingDate } = req.body;
  const { AdminId } = req.body;
  console.log(AdminId);
  Admin.addOneBooking(bookingID, bookingDate, AdminId, (err, result) => {
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
app.put('/updateBooking/:bookingIDs', printDebugInfo, (req, res) => {
  // extract id from params
  const BookingID = req.params.bookingIDs;
  // extract all details needed
  const { ScheduleDate } = req.body;
  // check if class pricing is float value and execute code

  // calling updateClass method from admin model
  Admin.updateBooking(ScheduleDate, BookingID, (err, result) => {
    // if there is no errorsend the following as result
    if (!err) {
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
//= ======================================================
//              Class of Service
//= ======================================================

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
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD send Inappropriate value as return message
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
      // result.affectedRows indicates that id to be deleted cannot be found hence send as error message
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

//= ======================================================
//              Features / Cancel Booking
//= ======================================================
// get booking that are pending or assigned per page
app.get('/bookingCancel/:pageNumber', printDebugInfo, async (req, res) => {
  // extract pageNumber from params to determine the page we are at
  const { pageNumber } = req.params;

  // calling pageEmployee method from admin model
  Admin.pageBookingCancel(pageNumber, (err, result) => {
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
// get all bookings that are pending or assigned
app.get('/bookingCancel', printDebugInfo, async (req, res) => {
  // calling getAllBookingCancel method from admin model
  Admin.getAllBookingCancel((err, result) => {
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
// update cancel booking
app.put('/cancelBooking/:id', printDebugInfo, (req, res) => {
  // extract id from params
  const bookingId = req.params.id;
  // calling cancelBookingAdmin method from admin model
  Admin.cancelBookingAdmin(

    bookingId,
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

//---------------------------------------------------
//                 Feature/schedule-Employee
//---------------------------------------------------

// get unassigned available employee
app.get('/availemployee/:date', printDebugInfo, async (req, res) => {
  // extract id from params
  const { date } = req.params;

  // calling getClass method from admin model
  Admin.getAvailableEmployee(date, (err, result) => {
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

// schedule employee availability
app.post('/availemployee/:employeeId', printDebugInfo, (req, res) => {
  // extract all details needed
  const { employeeId } = req.params;
  const { date } = req.body;
  const { time } = req.body;

  // calling addClass method from admin model
  Admin.addEmployeeAvailability(employeeId, date, time, (err, result) => {
    // if no error send results as positive
    if (!err) {
      const output = {
        success: true,
        'affected rows': result.affectedRows,
        'changed rows': result.changedRows,
      };
      res.status(201).send(output);
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
});

//---------------------------------------------------
//                 Feature/adminCustomer
//---------------------------------------------------

// get all customer
app.get('/customer', printDebugInfo, async (req, res) => {
  // calling getAllCustomer method from admin model
  Admin.getAllCustomer((err, result) => {
    // if no error send result
    if (!err) {
      res.status(200).send(result);
    }
    // if error send error message
    else {
      res.status(500).send('Some error');
    }
  });
});

// get an employee
app.get('/onecustomer/:id', printDebugInfo, async (req, res) => {
  // extract id from params
  const customerId = req.params.id;

  // calling getCustomer method from admin model
  Admin.getCustomer(customerId, (err, result) => {
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

// update customer
app.put('/customer/:id', printDebugInfo, (req, res) => {
  // extract id from params
  const CustomerID = req.params.id;
  // extract all details needed
  const { CustomerPassword } = req.body;
  const { CustomerStatus } = req.body;

  // calling updateCustomer method from admin model
  Admin.updateCustomer(CustomerPassword, CustomerStatus, CustomerID, (err, result) => {
    // if there is no errorsend the following as result
    if (!err) {
      const output = {
        customerId: result.insertId,
      };

      console.log(`result ${output.customerId}`);

      res.status(201).send(result);
    }
    // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD send Inappropriate value as return message
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

// delete customer
app.delete('/customer/:id', printDebugInfo, (req, res) => {
  // extract id from params
  const { id } = req.params;
  // calling deleteClass method from admin model
  Admin.deleteCustomer(id, (err, result) => {
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

//= ======================================================
//              Extra Services
//= ======================================================

// get all extra services
app.get('/extraServices', printDebugInfo, async (req, res) => {
  // calling getAllExtraServices method from admin model
  Admin.getAllExtraServices((err, result) => {
    if (!err) {
      console.log('==================================');
      console.log('get extra services');
      console.log('==================================');
      res.status(200).send(result);
    } else {
      res.status(500).send('Some error');
    }
  });
});

// get a class of sevice
app.get('/extraServices/:id', printDebugInfo, async (req, res) => {
  // extract id from params
  const extraserviceid = req.params.id;

  // calling getClass method from admin model
  Admin.getExtraService(extraserviceid, (err, result) => {
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

// add an extra service
app.post('/extraService', printDebugInfo, (req, res) => {
  // extract all details needed
  const { ExtraServiceName } = req.body;
  const { ExtraServicePrice } = req.body;

  // check if extra service pricing is float value and execute code
  if (Number.parseFloat(ExtraServicePrice)) {
    // calling addExtraService method from admin model
    Admin.addExtraService(ExtraServiceName, ExtraServicePrice, (err, result) => {
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

// update extra service
app.put('/extraService/:id', printDebugInfo, (req, res) => {
  // extract id from params
  const ExtraServiceID = req.params.id;
  // extract all details needed
  const { ExtraServiceName } = req.body;
  const { ExtraServicePrice } = req.body;

  // check if extra service pricing is float value and execute code
  if (Number.parseFloat(ExtraServicePrice)) {
    // calling updateExtraService method from admin model
    Admin.updateExtraService(ExtraServiceName, ExtraServicePrice, ExtraServiceID, (err, result) => {
      // if there is no errorsend the following as result
      if (!err) {
        const output = {
          ExtraServiceID: result.insertId,
        };

        console.log(`result ${output.ExtraServiceID}`);

        res.status(201).send(result);
      }
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD send Inappropriate value as return message
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

// delete extra service
app.delete('/extraService/:id', printDebugInfo, (req, res) => {
  // extract id from params
  const { id } = req.params;
  // calling deleteExtraService method from admin model
  Admin.deleteExtraService(id, (err, result) => {
    if (!err) {
      // result.affectedRows indicates that id to be deleted cannot be found hence send as error message
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

//= ======================================================
//              Rates
//= ======================================================

// get all rates
app.get('/rates', printDebugInfo, async (req, res) => {
  // calling getAllRates method from admin model
  Admin.getAllRates((err, result) => {
    if (!err) {
      console.log('==================================');
      console.log('get rates');
      console.log('==================================');
      res.status(200).send(result);
    } else {
      res.status(500).send('Some error');
    }
  });
});

// get a rate
app.get('/rates/:id', printDebugInfo, async (req, res) => {
  // extract id from params
  const rateid = req.params.id;

  // calling getClass method from admin model
  Admin.getRate(rateid, (err, result) => {
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

// add new rate
app.post('/rate', printDebugInfo, (req, res) => {
  // extract all details needed
  const { RateName } = req.body;
  const { RatePrice } = req.body;
  const { Package } = req.body;

  // check if rate pricing is float value and execute code
  if (Number.parseFloat(RatePrice)) {
    // calling addClass method from admin model
    Admin.addRate(RateName, RatePrice, Package, (err, result) => {
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

// update existing extra service
app.put('/rate/:id', printDebugInfo, (req, res) => {
  // extract id from params
  const RatesID = req.params.id;
  // extract all details needed
  const { RateName } = req.body;
  const { RatePrice } = req.body;
  const { Package } = req.body;

  // check if rate pricing is float value and execute code
  if (Number.parseFloat(RatePrice)) {
    // calling updateRate method from admin model
    Admin.updateRate(RateName, RatePrice, Package, RatesID, (err, result) => {
      // if there is no errorsend the following as result
      if (!err) {
        const output = {
          RatesID: result.insertId,
        };

        console.log(`result ${output.RatesID}`);

        res.status(201).send(result);
      }
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD send Inappropriate value as return message
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

// delete existing rate
app.delete('/rate/:id', printDebugInfo, (req, res) => {
  // extract id from params
  const { id } = req.params;
  // calling deleteRate method from admin model
  Admin.deleteRate(id, (err, result) => {
    if (!err) {
      // result.affectedRows indicates that id to be deleted cannot be found hence send as error message
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



// module exports
module.exports = app;
