/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */

// code
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// ====================== Imports ======================
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// moment library call
const moment = require('moment-weekdaysin');
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');
// const verifyToken = require('../auth/isLoggedInMiddleWare');

// ------------------ model ------------------
const Login = require('../model/login');
const Admin = require('../model/admin');
const Customer = require('../model/customer');
const Register = require('../model/register');
const SuperAdmin = require('../model/superAdmin');

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

// ====================== MiddleWare Functions ======================
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

// ====================== User Section ======================

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
        AdminID: result.AdminID,
        token,
        CustomerID: result.CustomerID,
        AdminType: result.AdminType,
      };
      res.status(200).send(msg);
    }
  });
});

// register
app.post('/registerCustomer', printDebugInfo, async (req, res, next) => {
  const { FirstName } = req.body;
  const { LastName } = req.body;
  const { Password } = req.body;
  const { Email } = req.body;
  const { Address } = req.body;
  const { PhoneNumber } = req.body;
  const { PostalCode } = req.body;

  // eslint-disable-next-line max-len
  Register.registerCustomer(FirstName, LastName, Password, Email, Address, PhoneNumber, PostalCode, (err, result) => {
    if (err) {
      // matched with callback (err, null)
      console.log(err);
      res.status(500);
      res.send(err.statusCode);
      return next(err);
    }
    res.status(201).send(result);
  });
});

// ====================== Admin Section ======================
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
      } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
        // send Inappropriate value as return message
        res.status(406).send('Inappropriate value');
      } else if (err.code === 'ER_BAD_NULL_ERROR') {
        // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
        res.status(400).send('Null value not allowed');
      } else {
        // else if there is a server error return message
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
        res.status(201).send(result);
      } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
        // send Inappropriate value as return message
        res.status(406).send('Inappropriate value');
      } else if (err.code === 'ER_BAD_NULL_ERROR') {
        // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
        res.status(400).send('Null value not allowed');
      } else {
        // else if there is a server error return message
        res.status(500).send('Internal Server Error');
      }
    });
  } else {
    // if class pricing is not float
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
      } else {
        // else a postitve result
        res.status(200).send(result);
      }
    } else {
      // sever error
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
      // if error send error message
      res.status(500).send('Some error');
    }
  });
});

// get all employee
app.get('/employee', printDebugInfo, async (req, res) => {
  // calling getAllEmployee method from admin model
  Admin.getAllEmployee((err, result) => {
    // if no error send result
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
      // if error send error message
      res.status(500).send('Some error');
    }
  });
});

// get an employee
app.get('/oneemployee/:id', printDebugInfo, async (req, res) => {
  // extract id from params
  const employeeId = req.params.id;

  // calling getEmployee method from admin model
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

  // calling updateEmployee method from admin model
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
      } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
        // send Inappropriate value as return message
        res.status(406).send('Inappropriate value');
      } else if (err.code === 'ER_BAD_NULL_ERROR') {
        // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
        res.status(400).send('Null value not allowed');
      } else {
        // else if there is a server error return message
        res.status(500).send('Internal Server Error');
      }
    },
  );
});

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

  // calling deleteEmployee method from admin model
  Admin.deleteEmployee(employeeId, (err, result1) => {
    if (!err) {
      console.log('DELETE EMPLOYEE STATEMENT');
      // result.affectedRows indicates that id to be deleted
      // cannot be found hence send as error message
      if (result1.affectedRows === 0) {
        res.status(404).send('Item cannot be deleted');
      } else {
        // else a postitve result
        console.log(output1.EmployeeImageCloudinaryFileId);
        cloudinary.uploader.destroy(output1.EmployeeImageCloudinaryFileId);
        // res.send(result1);
      }
    } else {
      // sever error
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

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
        const output1 = {
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
    Admin.updateEmployee(
      EmployeeName,
      EmployeeDes,
      EmployeeImgageCloudinaryFileId,
      EmployeeImageUrl,
      Skillsets,
      employeeId,
      (err) => {
        // if there is no error
        if (!err) {
          const output = 'done';
          return res.status(201).send(output);
        }
      },
    );
  } catch (error) {
    const output = {
      Error: 'Internal sever issues',
    };
    return res.status(500).send(output);
  }
});

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
    Admin.addEmployee(
      EmployeeName,
      EmployeeDes,
      EmployeeImgageCloudinaryFileId,
      EmployeeImageUrl,
      Skillsets,
      // eslint-disable-next-line no-shadow
      (err, result) => {
        // if there is no error
        if (!err) {
          const output = 'done';
          return res.status(201).send(output + result);
        }
      },
    );
  } catch (error) {
    const output = {
      Error: 'Internal sever issues',
    };
    return res.status(500).send(output);
  }
});

// get employee per page
app.get('/booking/:pageNumber', printDebugInfo, async (req, res) => {
  // extract pageNumber from params to determine the page we are at
  const { pageNumber } = req.params;

  // calling pageEmployee method from admin model
  Admin.pageBooking(pageNumber, (err, result) => {
    // if no error send result
    if (!err) {
      res.status(200).send(result);
    } else {
      // if error send error message
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
    } else {
      // if error send error message
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
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      res.status(400).send('Null value not allowed');
    } else {
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
  console.log('Im HERE');
  // check if class pricing is float value and execute code

  // calling updateClass method from admin model
  Admin.updateBooking(ScheduleDate, BookingID, (err, result) => {
    // if there is no errorsend the following as result
    if (!err) {
      res.status(201).send(result);
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      // send Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
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
      } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
        // send Inappropriate value as return message
        res.status(406).send('Inappropriate value');
      } else if (err.code === 'ER_BAD_NULL_ERROR') {
        // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
        res.status(400).send('Null value not allowed');
      } else {
        // else if there is a server error return message
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
        res.status(201).send(result);
      } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
        // send Inappropriate value as return message
        res.status(406).send('Inappropriate value');
      } else if (err.code === 'ER_BAD_NULL_ERROR') {
        // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
        res.status(400).send('Null value not allowed');
      } else {
        // else if there is a server error return message
        res.status(500).send('Internal Server Error');
      }
    });
  } else {
    // if class pricing is not float
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
      } else {
        // else a postitve result
        res.status(200).send(result);
      }
    } else {
      // sever error
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// get booking that are pending or assigned per page
app.get('/bookingCancel/:pageNumber', printDebugInfo, async (req, res) => {
  // extract pageNumber from params to determine the page we are at
  const { pageNumber } = req.params;

  // calling pageEmployee method from admin model
  Admin.pageBookingCancel(pageNumber, (err, result) => {
    // if no error send result
    if (!err) {
      res.status(200).send(result);
    } else {
      // if error send error message
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
    } else {
      // if error send error message
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
        res.status(201).send(result);
      } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
        // send Inappropriate value as return message
        res.status(406).send('Inappropriate value');
      } else if (err.code === 'ER_BAD_NULL_ERROR') {
        // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
        res.status(400).send('Null value not allowed');
      } else {
        // else if there is a server error return message
        res.status(500).send('Internal Server Error');
      }
    },
  );
});

// get unassigned available employee
app.get('/availemployee/:date', printDebugInfo, async (req, res) => {
  // extract id from params
  const { date } = req.params;

  // calling getAvailableEmployee method from admin model
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

  // calling addEmployeeAvailability method from admin model
  Admin.addEmployeeAvailability(employeeId, date, time, (err, result) => {
    // if no error send results as positive
    if (!err) {
      const output = {
        success: true,
        'affected rows': result.affectedRows,
        'changed rows': result.changedRows,
      };
      res.status(201).send(output);
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      // send Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});

// get all customer
app.get('/customer', printDebugInfo, async (req, res) => {
  // calling getAllCustomer method from admin model
  Admin.getAllCustomer((err, result) => {
    // if no error send result
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
      // if error send error message
      res.status(500).send('Some error');
    }
  });
});

// get an customer
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
      res.status(201).send(result);
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      // send Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});

// delete customer
app.delete('/customer/:id', printDebugInfo, (req, res) => {
  // extract id from params
  const { id } = req.params;
  // calling deleteCustomer method from admin model
  Admin.deleteCustomer(id, (err, result) => {
    if (!err) {
      // result.affectedRows indicates that id to be deleted
      // cannot be found hence send as error message
      if (result.affectedRows === 0) {
        res.status(404).send('Item cannot be deleted');
      } else {
        // else a postitve result
        res.status(200).send(result);
      }
    } else {
      // sever error
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

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
      } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
        // send Inappropriate value as return message
        res.status(406).send('Inappropriate value');
      } else if (err.code === 'ER_BAD_NULL_ERROR') {
        // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
        res.status(400).send('Null value not allowed');
      } else {
        // else if there is a server error return message
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
        res.status(201).send(result);
      } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
        // send Inappropriate value as return message
        res.status(406).send('Inappropriate value');
      } else if (err.code === 'ER_BAD_NULL_ERROR') {
        // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
        res.status(400).send('Null value not allowed');
      } else {
        // else if there is a server error return message
        res.status(500).send('Internal Server Error');
      }
    });
  } else {
    // if class pricing is not float
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
      // result.affectedRows indicates that id to be
      // deleted cannot be found hence send as error message
      if (result.affectedRows === 0) {
        res.status(404).send('Item cannot be deleted');
      } else {
        // else a postitve result
        res.status(200).send(result);
      }
    } else {
      // sever error
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

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
      } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
        // send Inappropriate value as return message
        res.status(406).send('Inappropriate value');
      } else if (err.code === 'ER_BAD_NULL_ERROR') {
        // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
        res.status(400).send('Null value not allowed');
      } else {
        // else if there is a server error return message
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
        res.status(201).send(result);
      } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
        // send Inappropriate value as return message
        res.status(406).send('Inappropriate value');
      } else if (err.code === 'ER_BAD_NULL_ERROR') {
        // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
        res.status(400).send('Null value not allowed');
      } else {
        // else if there is a server error return message
        res.status(500).send('Internal Server Error');
      }
    });
  } else {
    // if class pricing is not float
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
      // result.affectedRows indicates that id to be deleted
      // cannot be found hence send as error message
      if (result.affectedRows === 0) {
        res.status(404).send('Item cannot be deleted');
      } else {
        // else a postitve result
        res.status(200).send(result);
      }
    } else {
      // sever error
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

app.get('/contract/:id', printDebugInfo, async (req, res) => {
  // calling getBookingdetails method from admin model
  const details = req.params.id;

  Admin.getBookingDetails(details, (err, result) => {
    // if no error send result
    if (!err) {
      console.log('==================================');
      console.log('Continue');
      console.log('==================================');
      res.status(200).send(result);
    } else {
      // if error send error message
      res.status(500).send('Some error');
    }
  });
});

app.post('/employeeList', printDebugInfo, async (req, res) => {
  // calling getBookingdetails method from admin model
  const detail = req.body.bookingDates;

  Admin.getEmployeeAvailabilty(detail, (err, result) => {
    // if no error send result
    if (!err) {
      console.log('==================================');
      console.log('Continue');
      console.log('==================================');
      res.status(200).send(result);
    } else {
      // if error send error message
      res.status(500).send('Some error');
    }
  });
});

app.put('/assignBooking/:bookingIDs', printDebugInfo, async (req, res) => {
  // extract id from params
  const BookingID = req.params.bookingIDs;
  // extract all details needed
  const { EmployeeID } = req.body;
  console.log('Im HERE');
  // check if class pricing is float value and execute code

  // calling updateClass method from admin model
  Admin.assignBooking(EmployeeID, BookingID, (err, result) => {
    // if there is no errorsend the following as result
    if (!err) {
      res.status(201).send(result);
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      // send Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});
//= ======================================================
//              Features / Contract
//= ======================================================

// get Contracts per page
app.get('/contracts/:pageNumber', printDebugInfo, async (req, res) => {
  // extract pageNumber from parameter
  const { pageNumber } = req.params;

  // calling pageContract method from admin model
  Admin.pageContract(pageNumber, (err, result) => {
    // if no error send result
    if (!err) {
      res.status(200).send(result);
    } else {
    // if error send error message
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// Get admin profile by AdminID
app.get('/admin/profile/:id', printDebugInfo, async (req, res) => {
  // extract id from params
  const adminID = req.params.id;

  // calling getAdminById method from Admin model
  Admin.getAdminById(adminID, (err, result) => {
    if (!err) {
      // if admin id is not found detect and return error message
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

// Update admin details with id in web parameter
app.put('/update/admin/:id', printDebugInfo, (req, res) => {
  // extract id from params
  const adminID = req.params.id;
  // extract all details needed
  const { firstName } = req.body;
  const { lastName } = req.body;
  const { email } = req.body;

  // calling updateAdminProfile method from admin model
  // eslint-disable-next-line max-len
  Admin.updateAdminProfile(firstName, lastName, email, adminID, (err, result) => {
    // if there is no errorsend the following as result
    if (!err) {
      console.log(`result ${result.affectedRows}`);
      res.status(202).send(result);
    } else {
      res.status(500).send('Internal Server Error');
    }
  });
});

// Check admin password and return adminID if true
app.put('/admin/password/:id', printDebugInfo, async (req, res) => {
  // extract id from params
  const adminID = req.params.id;
  const { currentPassword } = req.body;
  // calling checkAdminPassword method from Admin model
  Admin.checkAdminPassword(adminID, currentPassword, (err, result) => {
    if (!err) {
      // output
      res.status(200).send(result);
    } else if (err.message === 'No result') {
      // if admin id is not found detect and return error message
      const output = {
        Error: 'Wrong password',
      };
      res.status(404).send(output);
    } else {
      // sending output as error message if there is any server issues
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

app.put('/admin/editPassword/:id', printDebugInfo, async (req, res) => {
  // extract id from params
  const adminID = req.params.id;
  const { confirmPassword } = req.body;
  // calling getAdminById method from Admin model
  Admin.updateAdminPassword(confirmPassword, adminID, (err, result) => {
    if (!err) {
      // if admin id is not found detect and return error message
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

app.get('/bookingsByMonth', printDebugInfo, async (req, res) => {
  // calling getAllClassOfService method from admin model
  Admin.getBookingByMonth((err, result) => {
    // array to store and send the finalOutput
    const finalOutput = [];
    // array to store and send all the months
    const month = [];
    // array to store number of booking made in a month
    const numMonthBooking = [];

    if (!err) {
      // loop through the months
      for (let i = 0; i < result.length; i++) {
        // pushing month and numbber of booking made in january if result for january is available
        if (result[i].month === 1) {
          month.push(result[i].month);
          numMonthBooking.push(result[i].numberOfBooking);
        }
        // pushing month and numbber of booking made in february if result for february is available
        if (result[i].month === 2) {
          month.push(result[i].month);
          numMonthBooking.push(result[i].numberOfBooking);
        }
        // pushing month and numbber of booking made in march if result for march is available
        if (result[i].month === 3) {
          month.push(result[i].month);
          numMonthBooking.push(result[i].numberOfBooking);
        }
        // pushing month and numbber of booking made in april if result for april is available
        if (result[i].month === 4) {
          month.push(result[i].month);
          numMonthBooking.push(result[i].numberOfBooking);
        }
        // pushing month and numbber of booking made in may if result for may is available
        if (result[i].month === 5) {
          month.push(result[i].month);
          numMonthBooking.push(result[i].numberOfBooking);
        }
        // pushing month and numbber of booking made in june if result for june is available
        if (result[i].month === 6) {
          month.push(result[i].month);
          numMonthBooking.push(result[i].numberOfBooking);
        }
        // pushing month and numbber of booking made in july if result for july is available
        if (result[i].month === 7) {
          month.push(result[i].month);
          numMonthBooking.push(result[i].numberOfBooking);
        }
        // pushing month and numbber of booking made in august if result for august is available
        if (result[i].month === 8) {
          month.push(result[i].month);
          numMonthBooking.push(result[i].numberOfBooking);
        }
        // pushing month and numbber of booking made in
        // september if result for september is available
        if (result[i].month === 9) {
          month.push(result[i].month);
          numMonthBooking.push(result[i].numberOfBooking);
        }
        // pushing month and numbber of booking made in october if result for january is available
        if (result[i].month === 10) {
          month.push(result[i].month);
          numMonthBooking.push(result[i].numberOfBooking);
        }
        // pushing month and numbber of booking made in
        // novemeber if result for novemeber is available
        if (result[i].month === 11) {
          month.push(result[i].month);
          numMonthBooking.push(result[i].numberOfBooking);
        }
        // pushing month and numbber of booking made in december if result for december is available
        if (result[i].month === 12) {
          month.push(result[i].month);
          numMonthBooking.push(result[i].numberOfBooking);
        }
      }

      // setting countNumBooking to 0
      let countNumBooking = 0;
      // getting length of the number of months that have booking
      const actualCountNumBooking = numMonthBooking.length;
      // for loop to check if booking for month was retrieved and assigning the
      // value of number of booking and month into finalOutput as objects
      for (let x = 1; x < 13; x++) {
        // check if the array month inclues value of x
        // and add the month and number of booking made in
        if (month.includes(x)) {
          // to ensure that the number of bookings that are
          // equivilent to the number of booking beign added
          countNumBooking++;
          if (countNumBooking <= actualCountNumBooking) {
            finalOutput.push({ month: x, numberOfBooking: numMonthBooking[countNumBooking - 1] });
          }
        } else {
          // if array does not include month get the month and put it's numberOfBooking as 0
          finalOutput.push({ month: x, numberOfBooking: 0 });
        }
      }
      // send all the months and number of booking made
      // in month as array of objects called finalOutput
      res.status(200).send(finalOutput);
    } else {
      res.status(500).send('Some error');
    }
  });
});

// get revenue of the month
app.get('/revenueOfTheMonth', printDebugInfo, async (req, res) => {
  // calling getAllRates method from admin model
  Admin.getRevenueOfTheMonth((err, result) => {
    if (!err) {
      // inistialise sum as 0
      let sum = 0;
      // loop throught the result and add the revenue calculated for each month as the sum
      for (let i = 0; i < result.length; i++) {
        // adding value to the sum
        sum += result[i].Revenue;
      }
      // assigning output as a object with the key of totalRevenue and value of sum calculated
      const output = { totalRevenue: sum };
      // send output
      res.status(200).send(output);
    } else {
      res.status(500).send('Some error');
    }
  });
});

// ====================== Customer Section ======================
// Get user profile
app.get('/customerAddBooking/:customerID', printDebugInfo, async (req, res, next) => {
  const customerId = req.params.customerID;

  Customer.getCustomerById(customerId, (err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else {
      return next(err);
    }
  });
});

app.get('/helpers/:bookingDates', printDebugInfo, async (req, res) => {
  const dates = req.params.bookingDates;

  // calling possibleAvailableHelpers method from customer model
  Customer.possibleAvailableHelpers(dates, (err, result) => {
    // if no error send result
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

// Update own account details
app.put('/update/customer/:id', printDebugInfo, (req, res) => {
  // extract id from params
  const customerId = req.params.id;
  // extract all details needed
  const { firstName } = req.body;
  const { lastName } = req.body;
  const { address } = req.body;
  const { postal } = req.body;
  const { phoneNumber } = req.body;
  const { email } = req.body;

  // calling updateCustProfile method from customer model
  // eslint-disable-next-line max-len
  Customer.updateCustProfile(firstName, lastName, address, postal, phoneNumber, email, customerId, (err, result) => {
    // if there is no errorsend the following as result
    if (!err) {
      console.log(`result ${result.affectedRows}`);

      res.status(202).send(result);
    } else {
      res.status(500).send('Internal Server Error');
    }
  });
});

app.get('/user/customer/:id', printDebugInfo, async (req, res) => {
  // extract id from params
  const customerId = req.params.id;

  // calling getCustomerById method from Customer model
  Customer.getCustomerById(customerId, (err, result) => {
    if (!err) {
      // if customer id is not found detect and return error message
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

// get all class of services
app.get('/classOfService', printDebugInfo, async (req, res) => {
  // calling getAllClassOfService method from customer model
  Customer.getAllClassOfService((err, result) => {
    if (!err) {
      console.log('==================================');
      console.log('get class of service');
      console.log('==================================');
      res.status(200).send(result);
    } else {
      res.status(500).send('Some error');
    }
  });
});

app.get('/show/bookings/:id', printDebugInfo, (req, res) => {
  // extract id from params
  const customerId = req.params.id;
  // calling updateCustProfile method from customer model
  // eslint-disable-next-line max-len
  Customer.getBookingDetails(customerId, (err, result) => {
    // if there is no errorsend the following as result
    if (!err) {
      console.log(`result ${result}`);

      res.status(202).send(result);
    } else {
      res.status(500).send('Internal Server Error');
    }
  });
});

app.post('/customer/autobooking', printDebugInfo, (req, res) => {
  // extract contract data from request body
  const { customer } = req.body;
  const { StartDate } = req.body;
  const { Package } = req.body;
  const { DayOfService } = req.body;
  const { DayOfService2 } = req.body;
  const { TimeOfService } = req.body;
  const { EstimatedPricing } = req.body;
  const { ExtraNotes } = req.body;
  const { NoOfRooms } = req.body;
  const { NoOfBathrooms } = req.body;
  const { Address } = req.body;
  const { Class } = req.body;
  const { Rate } = req.body;
  const { ExtraService } = req.body;

  // Declare newContractId variable
  let newContractId;
  // Get contract start date and convert to moment form
  const start = moment(StartDate);
  // Get last day of current month depending on the contract start date
  const end = moment(StartDate).endOf('month');
  // Declare a date array
  let dateArray = [];

  // Function to add a booking record
  function AddBooking(ContractID, ScheduleDate) {
    // invokes addBooking method created at superAdmin file in app.js
    // eslint-disable-next-line no-unused-vars
    SuperAdmin.addBooking(ContractID, ScheduleDate, (err, result) => {
      // if no error send result
      if (!err) {
        console.log('done');
      } else {
        // if error send error message
        res.status(500).send('Some error');
      }
    });
  }

  // Function to getDateRange from contract start date to last day of month
  // Gets the date of the wanted days between this range
  function getDateRange(day) {
    // Calls an empty dateArray to clear whatever is within it
    dateArray = [];
    // Gets the dayname from the contract start day and stores within tmp constant
    const tmp = start.clone().day(day);
    // Get the day number of the contract start date
    const startDay = start.day();
    // Converts startDay constant into name format
    // Stores within startDayName constant
    const startDayName = moment().day(startDay).format('ddd');

    // Check if day of contract start date is equals to the first day of service
    if (startDayName === DayOfService) {
      // Pushes contract start date into dateArray
      dateArray.push(start.format('YYYY-MM-DD'));
    }

    // Check if tmp is after the contract start date
    if (tmp.isAfter(start, 'd')) {
      // Pushes date into dateArray
      dateArray.push(tmp.format('YYYY-MM-DD'));
    }
    // While loop to check if tmp is before last day of the month
    while (tmp.isBefore(end)) {
      // Adds one week to the date
      tmp.add(7, 'days');
      // Pushes date into dateArray
      dateArray.push(tmp.format('YYYY-MM-DD'));
    }
  }

  // Function to getDateRange from contract start date to last day of month
  // Gets the date of the wanted days between this range
  // For those contracts which chose the second package
  function getDateRange2(day) {
    // Calls an empty dateArray to clear whatever is within it
    dateArray = [];
    // Gets the dayname from the contract start day and stores within tmp constant
    const tmp = start.clone().day(day);
    // Get the day number of the contract start date
    const startDay = start.day();
    // Converts startDay constant into name format
    // Stores within startDayName constant
    const startDayName = moment().day(startDay).format('ddd');

    // Check if day of contract start date is equals to the second day of service
    if (startDayName === DayOfService2) {
      // Pushes contract start date into dateArray
      dateArray.push(start.format('YYYY-MM-DD'));
    }

    // Check if tmp is after the contract start date
    if (tmp.isAfter(start, 'd')) {
      // Pushes date into dateArray
      dateArray.push(tmp.format('YYYY-MM-DD'));
    }
    // While loop to check if tmp is before last day of the month
    while (tmp.isBefore(end)) {
      // Adds one week to the date
      tmp.add(7, 'days');
      // Pushes date into dateArray
      dateArray.push(tmp.format('YYYY-MM-DD'));
    }
  }

  // invokes addContract method created at Customer model
  Customer.addContract(
    customer,
    StartDate,
    Package,
    DayOfService,
    DayOfService2,
    TimeOfService,
    EstimatedPricing,
    ExtraNotes,
    NoOfRooms,
    NoOfBathrooms,
    Address,
    Class,
    Rate,
    ExtraService,
    (err, result) => {
      if (!err) {
        // stores the contract Id returned into the newContractId variable
        newContractId = result.insertId;
        if (DayOfService.includes('Mon')) {
          // check if DayOfService includes 'Mon' which represents monday
          getDateRange(1);
          // loop through the mondays and extract the date
          for (let x = 0; x < dateArray.length - 1; x++) {
            // Stores the date into ScheduleDate const
            const ScheduleDate = dateArray[x];
            // call addbooking function
            AddBooking(newContractId, ScheduleDate);
          }
        } else if (DayOfService.includes('Tue')) {
          // check if DayOfService includes 'Tue' which represents tuesday
          getDateRange(2);
          // loop through the tuesday and extract the date
          for (let x = 0; x < dateArray.length - 1; x++) {
            // Stores the date into ScheduleDate const
            const ScheduleDate = dateArray[x];
            // call addbooking function
            AddBooking(newContractId, ScheduleDate);
          }
        } else if (DayOfService.includes('Wed')) {
          // check if DayOfService includes 'Wed' which represents tuesday
          getDateRange(3);
          // loop through the wednesday and extract the date
          for (let x = 0; x < dateArray.length - 1; x++) {
            // Stores the date into ScheduleDate const
            const ScheduleDate = dateArray[x];
            // call addbooking function
            AddBooking(newContractId, ScheduleDate);
          }
        } else if (DayOfService.includes('Thu')) {
          // check if DayOfService includes 'Thu' which represents tuesday
          getDateRange(4);
          // loop through the thursday and extract the date
          for (let x = 0; x < dateArray.length - 1; x++) {
            // Stores the date into ScheduleDate const
            const ScheduleDate = dateArray[x];
            // call addbooking function
            AddBooking(newContractId, ScheduleDate);
          }
        } else if (DayOfService.includes('Fri')) {
          // check if DayOfService includes 'Fri' which represents tuesday
          getDateRange(5);
          // loop through the friday and extract the date
          for (let x = 0; x < dateArray.length - 1; x++) {
            // Stores the date into ScheduleDate const
            const ScheduleDate = dateArray[x];
            // call addbooking function
            AddBooking(newContractId, ScheduleDate);
          }
        } else if (DayOfService.includes('Sat')) {
          // check if DayOfService includes 'Sat' which represents tuesday
          getDateRange(6);
          // loop through the saturday and extract the date
          for (let x = 0; x < dateArray.length - 1; x++) {
            // Stores the date into ScheduleDate const
            const ScheduleDate = dateArray[x];
            // call addbooking function
            AddBooking(newContractId, ScheduleDate);
          }
        } else if (DayOfService.includes('Sun')) {
          // check if DayOfService includes 'Sun' which represents tuesday
          getDateRange(0);
          // loop through the sunday and extract the date
          for (let x = 0; x < dateArray.length - 1; x++) {
            // Stores the date into ScheduleDate const
            const ScheduleDate = dateArray[x];
            // call addbooking function
            AddBooking(newContractId, ScheduleDate);
          }
        }

        // check if Pakage equals to 2
        if (Package === '2') {
          // check if DayOfService2 includes 'Mon' which represents monday
          if (DayOfService2.includes('Mon')) {
            getDateRange2(1);
            // loop through the mondays and extract the date
            for (let x = 0; x < dateArray.length - 1; x++) {
              // Stores the date into ScheduleDate const
              const ScheduleDate = dateArray[x];
              // call addbooking function
              AddBooking(newContractId, ScheduleDate);
            }
          } else if (DayOfService2.includes('Tue')) {
            // check if DayOfService2 includes 'Tue' which represents tuesday
            getDateRange2(2);
            // loop through the tuesday and extract the date
            for (let x = 0; x < dateArray.length - 1; x++) {
              // Stores the date into ScheduleDate const
              const ScheduleDate = dateArray[x];
              // call addbooking function
              AddBooking(newContractId, ScheduleDate);
            }
          } else if (DayOfService2.includes('Wed')) {
            // check if DayOfService2 includes 'Wed' which represents tuesday
            getDateRange2(3);
            // loop through the wednesday and extract the date
            for (let x = 0; x < dateArray.length - 1; x++) {
              // Stores the date into ScheduleDate const
              const ScheduleDate = dateArray[x];
              // call addbooking function
              AddBooking(newContractId, ScheduleDate);
            }
          } else if (DayOfService2.includes('Thu')) {
            // check if DayOfService2 includes 'Thu' which represents tuesday
            getDateRange2(4);
            // loop through the thursday and extract the date
            for (let x = 0; x < dateArray.length - 1; x++) {
              // Stores the date into ScheduleDate const
              const ScheduleDate = dateArray[x];
              // call addbooking function
              AddBooking(newContractId, ScheduleDate);
            }
          } else if (DayOfService2.includes('Fri')) {
            // check if DayOfService2 includes 'Fri' which represents tuesday
            getDateRange2(5);
            // loop through the friday and extract the date
            for (let x = 0; x < dateArray.length - 1; x++) {
              // Stores the date into ScheduleDate const
              const ScheduleDate = dateArray[x];
              // call addbooking function
              AddBooking(newContractId, ScheduleDate);
            }
          } else if (DayOfService2.includes('Sat')) {
            // check if DayOfService2 includes 'Sat' which represents tuesday
            getDateRange2(6);
            // loop through the saturday and extract the date
            for (let x = 0; x < dateArray.length - 1; x++) {
              // Stores the date into ScheduleDate const
              const ScheduleDate = dateArray[x];
              // call addbooking function
              AddBooking(newContractId, ScheduleDate);
            }
          } else if (DayOfService2.includes('Sun')) {
            // check if DayOfService2 includes 'Sun' which represents tuesday
            getDateRange2(0);
            // loop through the sunday and extract the date
            for (let x = 0; x < dateArray.length - 1; x++) {
              // Stores the date into ScheduleDate const
              const ScheduleDate = dateArray[x];
              // call addbooking function
              AddBooking(newContractId, ScheduleDate);
            }
          }
        }
        // respond
        res.status(201).send(result);
      } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        res.status(406).send('Inappropriate value');
      } else if (err.code === 'ER_BAD_NULL_ERROR') {
        res.status(400).send('Null value not allowed');
      } else {
        res.status(500).send('Internal Server Error');
      }
    },
  );
});

// get all packages
app.get('/package', printDebugInfo, async (req, res) => {
  // calling getAllPackage method from customer model
  Customer.getAllPackage((err, result) => {
    if (!err) {
      console.log('==================================');
      console.log('get package');
      console.log('==================================');
      res.status(200).send(result);
    } else {
      res.status(500).send('Some error');
    }
  });
});

// get all rates
app.get('/rates', printDebugInfo, async (req, res) => {
  // calling getAllRates method from customer model
  Customer.getAllRates((err, result) => {
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

// get all additional service
app.get('/additionalService', printDebugInfo, async (req, res) => {
  // calling getAllAdditionalService method from customer model
  Customer.getAllAdditionalService((err, result) => {
    if (!err) {
      console.log('==================================');
      console.log('get additional service');
      console.log('==================================');
      res.status(200).send(result);
    } else {
      res.status(500).send('Some error');
    }
  });
});
// cancel booking for customer
app.put('/update/customerBooking/:id', printDebugInfo, (req, res) => {
  // extract id from params
  const bookingId = req.params.id;

  // cancel booking function that update the status of booking
  // eslint-disable-next-line no-shadow
  function cancelBooking(bookingId) {
    Customer.updateBookingStatus(bookingId, (err, result) => {
      // if there is no errorsend the following as result
      if (!err) {
        res.status(202).send(result);
      } else {
        res.status(500).send('Internal Server Error');
      }
    });
  }

  // get currentDate
  const currentDate = new Date();
  // ger currentTime
  // eslint-disable-next-line no-unused-vars
  const currentTime = moment().format('HH:MM:SS');
  // initialising variables for bookingDate
  let bookingDate;
  // initialising variables for bookingTime
  // eslint-disable-next-line no-unused-vars
  let bookingTime;
  // initialising variables for diffInDates
  let diffInDates;
  // initialising variables for diffInHours
  let diffInHours;
  // initialising variables for diffInTime
  // eslint-disable-next-line no-unused-vars
  let diffInTime;
  // initialising variables for statusOfAppointment
  let statusOfAppointment;

  // get a cusotmer by id
  Customer.getABookingById(bookingId, (err, result) => {
    // if there is no errorsend the following as result
    if (!err) {
      // get bookingDate from the result
      bookingDate = result[0].ScheduleDate;
      // get bookingTIme from the result
      bookingTime = result[0].TimeOfService;
      // get statusOfAppointment from the result
      statusOfAppointment = result[0].Status;
      // calculating diffInDates
      diffInDates = moment(bookingDate).diff(moment(currentDate), 'days');
      // calculating diffInHours
      diffInHours = moment(bookingDate).diff(moment(currentDate), 'hours');

      // check if status of appointment is cancelled and send result as already cancelled
      if (statusOfAppointment === 'Cancelled') {
        console.log('Already cancelled');
        res.status(200).send('Already cancelled');
      } else if (diffInDates === 0) {
        // check if diffInDates equals to 0
        // check if diffInHours equals to 0 and send result Cannot cancel as appointment is today
        if (diffInHours === 0) {
          console.log('Cannot cancel as appointment is today');
          res.status(200).send('Cannot cancel as appointment is today');
        } else {
          // else send result Cannot cancel as appointment is tmr
          console.log('Cannot cancel as appointment is tmr');
          res.status(200).send('Cannot cancel as appointment is tmr');
        }
      } else if (diffInDates < 0) {
        // check if diffInDates less than 0 and send result Cannot cancel as appointment is finished
        console.log('Cannot cancel as appointment is finished');
        res.status(200).send('Cannot cancel as appointment is finished');
      } else {
        // else call the cancelBooking() function with it's id
        console.log('Cancel');
        cancelBooking(bookingId);
      }
    } else {
      res.status(500).send('Internal Server Error');
    }
  });
});
// Get all contracts
app.get('/contracts', printDebugInfo, async (req, res) => {
  // calling getAllContracts method from admin model
  Admin.getAllContracts((err, result) => {
    // if no error send result
    if (!err) {
      res.status(200).send(result);
    } else {
    // if error send error message
      res.status(500).send('Some error');
    }
  });
});

// ====================== Super Admin Section ======================
// get all admin
app.get('/admin', printDebugInfo, async (req, res) => {
  // calling getAllAdmins method from SuperAdmin model
  SuperAdmin.getAllAdmins((err, result) => {
    // if no error send result
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
      // if error send error message
      res.status(500).send('Some error');
    }
  });
});

// get an admin
app.get('/oneadmin/:id', printDebugInfo, async (req, res) => {
  // extract id from params
  const adminId = req.params.id;

  // calling getAdmin method from SuperAdmin model
  SuperAdmin.getAdmin(adminId, (err, result) => {
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

// update admin
app.put('/admin/:id', printDebugInfo, (req, res) => {
  // extract id from params
  const AdminID = req.params.id;
  // extract all details needed
  const { AdminPwd } = req.body;
  const { AdminType } = req.body;

  // calling updateSuperAdmin method from SuperAdmin model
  SuperAdmin.updateAdmin(AdminPwd, AdminType, AdminID, (err, result) => {
    // if there is no errorsend the following as result
    if (!err) {
      const output = {
        AdminId: result.insertId,
      };
      console.log(`result ${output.AdminId}`);
      res.status(201).send(result);
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD send
      // Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});

// delete admin
app.delete('/admin/:id', printDebugInfo, (req, res) => {
  // extract id from params
  const { id } = req.params;

  // calling deleteAdmin method from SuperAdmin model
  SuperAdmin.deleteAdmin(id, (err, result) => {
    if (!err) {
      // result.affectedRows indicates that id to be deleted
      // cannot be found hence send as error message
      if (result.affectedRows === 0) {
        res.status(404).send('Item cannot be deleted');
      } else {
        // else a postitve result
        res.status(200).send(result);
      }
    } else {
      // sever error
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// add an admin
app.post('/addAdmin', printDebugInfo, (req, res) => {
  // extract all details needed
  const { LastName } = req.body;
  const { FirstName } = req.body;
  const { AdminPwd } = req.body;
  const { AdminEmail } = req.body;
  const { AdminType } = req.body;

  // calling addAdmin method from SuperAdmin model
  SuperAdmin.addAdmin(LastName, FirstName, AdminPwd, AdminEmail, AdminType, (err, result) => {
    if (!err) {
      const output = {
        AdminId: result.insertId,
      };
      console.log(`result ${output.AdminId}`);
      res.status(201).send(result);
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD send
      // Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});

app.post('/autoBooking', printDebugInfo, async (req, res) => {
  // array that will store all contracts already booked with duplicates
  const contractsAlreadyBooked = [];
  // array that will store all contracts already booked without duplicates
  let contractsAlreadyBookedNoDuplicate = [];
  // array that will store all valid contracts
  const allValidContracts = [];
  // array that will store contracts already booked with duplicates
  const contractsYetToBeBooked = [];

  // // add new booking function that takes two parameters ContractID and ScheduleDate
  function AddBooking(ContractID, ScheduleDate) {
    // invokes addBooking method created at superAdmin file in app.js
    superAdmin.addBooking(ContractID, ScheduleDate, (err, result) => {
      if (err) {
        res.status(500).send('Some error');
      }
    });
  }
  // select schedule date based on day of service
  function dateSelection(ContractID, DayOfService) {
    if (DayOfService.includes('Mon')) {
      // find all dates of monday in the month using moment
      const MondaysInMonth = moment().weekdaysInMonth('Monday');

      // loop through the mondays and extract the date
      for (x = 0; x < MondaysInMonth.length; x++) {
        // format date in YYYY-MM-DD format
        ScheduleDate = MondaysInMonth[x].format('YYYY-MM-DD');
        // call addbooking function
        AddBooking(ContractID, ScheduleDate);
      }
    } else if (DayOfService.includes('Tue')) {
      // find all dates of wednesday in the month using moment
      const TuesdaysInMonth = moment().weekdaysInMonth('Tuesday');
      // loop through the mondays and extract the date
      for (x = 0; x < TuesdaysInMonth.length; x++) {
        // format date in YYYY-MM-DD format
        ScheduleDate = TuesdaysInMonth[x].format('YYYY-MM-DD');
        // call addbooking function
        AddBooking(ContractID, ScheduleDate);
      }
    } else if (DayOfService.includes('Wed')) {
      // find all dates of wednesday in the month using moment
      const WednesdayInMonth = moment().weekdaysInMonth('Wednesday');
      // loop through the mondays and extract the date
      for (x = 0; x < WednesdayInMonth.length; x++) {
        // format date in YYYY-MM-DD format
        ScheduleDate = WednesdayInMonth[x].format('YYYY-MM-DD');
        // call addbooking function
        AddBooking(ContractID, ScheduleDate);
      }
    } else if (DayOfService.includes('Thu')) {
      // find all dates of wednesday in the month using moment
      const ThudaysInMonth = moment().weekdaysInMonth('Thursday');
      // loop through the mondays and extract the date
      for (x = 0; x < ThudaysInMonth.length; x++) {
        // format date in YYYY-MM-DD format
        ScheduleDate = ThudaysInMonth[x].format('YYYY-MM-DD');
        // call addbooking function
        AddBooking(ContractID, ScheduleDate);
      }
    } else if (DayOfService.includes('Fri')) {
      // find all dates of wednesday in the month using moment
      const FridayInMonth = moment().weekdaysInMonth('Friday');
      // loop through the mondays and extract the date
      for (x = 0; x < FridayInMonth.length; x++) {
        // format date in YYYY-MM-DD format
        ScheduleDate = FridayInMonth[x].format('YYYY-MM-DD');
        // call addbooking function
        AddBooking(ContractID, ScheduleDate);
      }
    } else if (DayOfService.includes('Sat')) {
      // find all dates of wednesday in the month using moment
      const SaturdaysInMonth = moment().weekdaysInMonth('Saturday');
      // loop through the mondays and extract the date
      for (x = 0; x < SaturdaysInMonth.length; x++) {
        // format date in YYYY-MM-DD format
        ScheduleDate = SaturdaysInMonth[x].format('YYYY-MM-DD');
        // call addbooking function
        AddBooking(ContractID, ScheduleDate);
      }
    } else if (DayOfService.includes('Sun')) {
      // find all dates of wednesday in the month using moment
      const SundaysInMonth = moment().weekdaysInMonth('Sunday');
      // loop through the mondays and extract the date
      for (x = 0; x < SundaysInMonth.length; x++) {
        // format date in YYYY-MM-DD format
        ScheduleDate = SundaysInMonth[x].format('YYYY-MM-DD');
        // call addbooking function
        AddBooking(ContractID, ScheduleDate);
      }
    }
  }
  // getAllValideContracts
  function getAllValidContacts() {
    // gets all valid contracts including the booked ones
    superAdmin.getAutoBookingValidContracts((err, result1) => {
      if (!err) {
        // use for loop to extract it's contractId and push it to the array of allValidContracts
        for (x = 0; x < result1.length; x++) {
          const contracId = result1[x].ContractID;
          allValidContracts.push(contracId);
        }
        // for loop to check if contractId that is already booked is part of the valid contracts
        for (y = 0; y < allValidContracts.length; y++) {
          // extracting contract
          const contractId = allValidContracts[y];
          // check if contractId is in the array of already booked contract
          // if it is not push it to the array of contractsYetToBeBooked
          if (!(contractsAlreadyBookedNoDuplicate.includes(contractId))) {
            contractsYetToBeBooked.push(contractId);
            // console.log(`Booked already: ${contractId}`);
          }
        }
        // loop through contractsYetToBeBooked
        for (z = 0; z < contractsYetToBeBooked.length; z++) {
          // get the contractId
          ContractId = contractsYetToBeBooked[z];
          // get all fileds related to the contractId
          superAdmin.getAContract(ContractId, (err, result55) => {
            // if no error send result
            if (!err) {
              // extract ContractID
              const { ContractID } = result55[0];
              // extract Package
              const { Package } = result55[0];
              // extract DayOfService
              const { DayOfService } = result55[0];
              // extract DayOfService2
              const { DayOfService2 } = result55[0];

              // call dateSelection and pass ContractID and DayOfService as params
              dateSelection(ContractID, DayOfService);
              // check if Package ==2
              if (Package === 2) {
                // call dateSelection and pass ContractID and DayOfService2 as params
                dateSelection(ContractID, DayOfService2);
              }
            } else {
            // if error send error message
              res.status(500).send('Some error');
            }
          });
        }
        res.status(200).send('done');
      } else {
        res.status(500).send('Some error');
      }
    });
  }
  // getAllBookingForAutoBookingFunction
  superAdmin.getAllBookingForAutoBookingFunc((err, result) => {
    if (!err) {
      // checks if there is booking made for a contract already
      for (i = 0; i < result.length; i++) {
        // get value of current year
        const currentYear = moment().year();
        // get value of current month
        const currentMonth = moment().month();
        // get scheduleDateOfBooking
        const scheduleDate = moment(result[i].ScheduleDate);
        // get value of scheduleDate month
        const scheduleMonth = scheduleDate.month();
        // get value of scheduleDate year
        const scheduleYear = scheduleDate.year();
        // get booking id
        const bookingId = result[i].BookingID;
        // get contract id
        const contractId = result[i].ContractId;
        // check if currentYear equals to scheduleYear and if
        // current month equals to scheduleMonth if yes push the contract id as already booked
        if ((currentYear === scheduleYear) && (currentMonth === scheduleMonth)) {
          contractsAlreadyBooked.push(contractId);
        }
      }
      // remove duplicate bookings
      contractsAlreadyBookedNoDuplicate = [...new Set(contractsAlreadyBooked)];
      // call getAllValidContacts()
      getAllValidContacts();
    } else {
      res.status(500).send('Some error');
    }
  });
});
// ====================== Module Exports ======================
module.exports = app;
