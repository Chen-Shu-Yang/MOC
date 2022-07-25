/* eslint-disable linebreak-style */
/* eslint-disable func-names */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */

const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';

let userSearchChar = [];
const userSearch = document.getElementById('searchEmployee');
const tmpToken = JSON.parse(localStorage.getItem('token'));
const tempAdminID = JSON.parse(localStorage.getItem('AdminID'));

if (tmpToken === null || tempAdminID === null) {
  window.localStorage.clear();
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}

function createRow(cardInfo) {
  const card = `
    <div class="employee-card">
        <div class="employee-id">
          <img src="${cardInfo.EmployeeImgUrl}" alt="">
          <span>${cardInfo.EmployeeName}</span>
        </div>
        <p class="employee-des">${cardInfo.EmployeeDes}</p>
        <div class="employee-links">
          <a href="" data-toggle="modal" data-target="#viewEmpAvailabilityModal" onClick="loadAnEmployee(${cardInfo.EmployeeID})">View Availability</a>
        </div>
        <div class="employee-btn">
          <button type="button" class="edit-btn" data-toggle="modal" data-target="#editModal" onClick="loadAnEmployee(${cardInfo.EmployeeID})">Edit</button>
          <button type="button" class="delete-btn" data-toggle="modal" data-target="#deleteModal" onClick="loadAnEmployee(${cardInfo.EmployeeID})">Delete</button>
        </div>
    </div>
  `;
  return card;
}

// Create page tabs
function pageBtnCreate(totalNumberOfPages, activePage) {
  // Clears pagination section
  $('#pagination').html('');
  // Get page number of max-left and max-right page
  let maxLeft = (activePage - Math.floor(5 / 2));
  let maxRight = (activePage + Math.floor(5 / 2));

  // Checks if the max-left page is less than 1
  // Which is the first page
  if (maxLeft < 1) {
    maxLeft = 1;
    maxRight = 5;
  }

  // Checks if max-right page is more than the total number of pages
  // Which is the last page
  if (maxRight > totalNumberOfPages) {
    maxLeft = totalNumberOfPages - (5 - 1);
    maxRight = totalNumberOfPages;

    // Checks if max-left is less than 1
    // Which is total number of pages within 1 and 5
    if (maxLeft < 1) {
      maxLeft = 1;
    }
  }

  // Checks if activepage is less than 1
  // Shows the '<<' icon to bring user to the first page
  if (activePage !== 1) {
    divPaginBtn = `<button type="button" onClick="loadEmployeeByLimit(${1})"><<</button>`;
    $('#pagination').append(divPaginBtn);
  }

  // Check if the active page is within max-left or max-right
  // Displays all page tabs within max-left and max-right
  for (i = maxLeft; i <= maxRight; i++) {
    // Check if page is active
    if (i === activePage) {
      divPaginBtn = `<button type="button" class="active" onClick="loadEmployeeByLimit(${i})">${i}</button>`;
      $('#pagination').append(divPaginBtn);
    } else {
      divPaginBtn = `<button type="button" onClick="loadEmployeeByLimit(${i})">${i}</button>`;
      $('#pagination').append(divPaginBtn);
    }
  }

  // Checkd if active page is not equals to the total number of pages
  // Displays the '>>' tab to bring users to the last page
  if (activePage !== totalNumberOfPages) {
    divPaginBtn = `<button type="button" onClick="loadEmployeeByLimit(${totalNumberOfPages})">>></button>`;
    $('#pagination').append(divPaginBtn);
  }
}

function loadAllEmployees(activePage) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/employee`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',

    success(data) {
      userSearchChar = data;
      const totalNumberOfPages = Math.ceil(data.length / 6);

      pageBtnCreate(totalNumberOfPages, activePage);
    },

    error(errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }
    },
  });
}

function loadEmployeeByLimit(pageNumber) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/employee/${pageNumber}`,
    type: 'GET',

    contentType: 'application/json; charset=utf-8',

    success(data) {
      $('#employeeListing').html('');

      for (let i = 0; i < data.length; i++) {
        const employee = data[i];

        const RowInfo = {
          EmployeeID: employee.EmployeeID,
          EmployeeName: employee.EmployeeName,
          EmployeeDes: employee.EmployeeDes,
          EmployeeImgUrl: employee.EmployeeImgUrl,
          Skillsets: employee.Skillsets,
        };

        const newRow = createRow(RowInfo);
        $('#employeeListing').append(newRow);
      }
      loadAllEmployees(pageNumber);
    },

    error(errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }
    },
  });
}

function loadEmployeeAvailability() {
  const employeeId = $('#availEmployeeID').val();
  const dateExtracted = $('#datepicker').val();

  if (dateExtracted === '') {
    new Noty({
      timeout: '3000',
      type: 'error',
      layout: 'topCenter',
      theme: 'sunset',
      text: 'Date is not Selected!',
    }).show();
    return;
  }

  $.ajax({
    url: `${backEndUrl}/employee/availability/${employeeId}/${dateExtracted}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',

    success(data) {
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);
      // $('#availabilityTimeslots').html('');

      if (data.length === 0) {
        // Ensure the color of the timeslot changes
        $('#eightThirtySlot').removeClass('unavailable');
        $('#twelveThirtySlot').removeClass('unavailable');
        $('#eightThirtySlot').removeClass('available');
        $('#twelveThirtySlot').removeClass('available');
        $('#eightThirtySlot').addClass('unavailable');
        $('#twelveThirtySlot').addClass('unavailable');

        new Noty({
          timeout: '3000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Employee is not available on this date',
        }).show();
      } else {
        for (let i = 0; i < data.length; i++) {
          const employee = data[i];

          const RowInfo = {
            EmployeeID: employee.Employee,
            ScheduleDate: employee.ScheduleDate,
            TimeSlot: employee.TimeSlot,
            ScheduleID: employee.ScheduleID,
          };

          console.log('---------Card INfo data pack------------');
          console.log(RowInfo);

          if (RowInfo.TimeSlot === '08:30:00') {
            // Ensure the color of the timeslot changes
            $('#eightThirtySlot').removeClass('unavailable');
            $('#twelveThirtySlot').removeClass('unavailable');
            $('#eightThirtySlot').removeClass('available');
            $('#twelveThirtySlot').removeClass('available');
            $('#eightThirtySlot').addClass('available');
            $('#twelveThirtySlot').addClass('unavailable');
            new Noty({
              timeout: '3000',
              type: 'success',
              layout: 'topCenter',
              theme: 'sunset',
              text: 'Employee is available at 08:30:00 today!',
            }).show();
          } else {
            // Ensure the color of the timeslot changes
            $('#eightThirtySlot').removeClass('unavailable');
            $('#twelveThirtySlot').removeClass('unavailable');
            $('#eightThirtySlot').removeClass('available');
            $('#twelveThirtySlot').removeClass('available');
            $('#eightThirtySlot').addClass('unavailable');
            $('#twelveThirtySlot').addClass('available');
            new Noty({
              timeout: '3000',
              type: 'success',
              layout: 'topCenter',
              theme: 'sunset',
              text: 'Employee is available at 12:30:00 today!',
            }).show();
          }
        }
      }
    },

    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');

      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);

      console.log(xhr.responseText);
      console.log(xhr.status);
    },
  });
}

// eslint-disable-next-line no-unused-vars
function loadAnEmployee(id) {

  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/oneemployee/${id}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',

    success(data) {

      const employee = data[0];

      const RowInfo = {
        EmployeeID: employee.EmployeeID,
        Name: employee.EmployeeName,
        Description: employee.EmployeeDes,
        EmployeeImg: employee.EmployeeImgUrl,
        Skillsets: employee.Skillsets,
        MobileNo: employee.MobileNo,
      };

      document.getElementById('NewProfilePreview').style.backgroundImage = `url(${RowInfo.EmployeeImg})`;
      $('#editEmployeeID').val(RowInfo.EmployeeID);
      $('#availEmployeeID').val(RowInfo.EmployeeID);
      $('#deleteEmployeeID').val(RowInfo.EmployeeID);
      $('#editEmployeeName').val(RowInfo.Name);
      $('#editEmployeeDes').val(RowInfo.Description);
      $('#editEmployeeSkills').val(RowInfo.Skillsets);
      $('#editProfilePicLink').val(RowInfo.EmployeeImg);
      $('#editEmployeePhone').val(RowInfo.MobileNo);
    },

    error(errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }
    },
  });
}

function updateEmployee() {
  const id = $('#editEmployeeID').val();
  // get value of the image uploaded from input file
  // eslint-disable-next-line camelcase
  const image_edit = document.getElementById('image_edit');

  // get value of the employee name from employee name field
  const employeeName = $('#editEmployeeName').val();
  // get value from employee description field
  const employeeDes = $('#editEmployeeDes').val();
  // get value from skill set field
  const skillSet = $('#editEmployeeSkills').val();
  // get value from employee phone field
  const MobileNo = $('#editEmployeePhone').val();
  //  pattern for Mobile No
  const phoneNumberPattern = new RegExp('^(6|8|9)\\d{7}$');
  // check if Mobile match with the pattern
  if (!phoneNumberPattern.test(MobileNo)) {
    new Noty({
      timeout: '5000',
      type: 'error',
      layout: 'topCenter',
      theme: 'sunset',
      text: 'Please enter a valid Mobile Number.',
    }).show();
    return;
  }

  // Get the initial image url
  const initialImg = $('#NewProfilePreview').css('background-image').replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
  // create a variable called webFormData and call the FormData
  // instance all field value to be added will be appended to webFormData
  const webFormData = new FormData();
  // webFormData.append method to append employeeName to the key of employeeName
  webFormData.append('employeeName', employeeName);
  // webFormData.append method to append employeeDes to the key of employeeDes
  webFormData.append('employeeDes', employeeDes);
  // webFormData.append method to append skillSet to the key of skillSet
  webFormData.append('skillSet', skillSet);
  // webFormData.append method to append MobileNo to the key of MobileNo
  webFormData.append('MobileNo', MobileNo);
  // webFormData.append method to append initialImg to the key of initialImg
  webFormData.append('initialImg', initialImg);
  // webFormData.append method to append image.files[0] to the key of image
  // eslint-disable-next-line camelcase
  webFormData.append('image_edit', image_edit.files[0]);
  // ajax fuction to connect to the backend

  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    // url to connect to backend api
    url: `${backEndUrl}/employee/${id}`,
    // method type
    type: 'PUT',
    // setting processData false
    processData: false,
    // setting contentType false
    contentType: false,
    // setting cache false
    cache: false,
    // pass webForm data as data
    data: webFormData,
    // pass enctype as multipart/formdata
    enctype: 'multipart/form-data',
    // success method
    success() {
      // set value to empty after getting value
      $('#editEmployeeName').val('');
      $('#editEmployeeDes').val('');
      $('#editEmployeeSkills').val('');
      $('#editEmployeePhone').val('');
      document.getElementById('image_edit').value = '';

      // succcess message return
      msg = 'Successfully Updated!';
      new Noty({
        timeout: '3000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();
      $('#employeeListing').html('');
      loadEmployeeByLimit(1);
    },
    // error method
    error(xhr) {
      // error message return
      if (xhr.status === 500) {
        let errMsg = '';
        errMsg = 'Server Error';
        new Noty({
          timeout: '3000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: errMsg,
        }).show();
      }
    },
  });
}

function deleteEmployee(id) {
  // call the web service endpoint for deleting class of service by id
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/employee/${id}`,
    type: 'DELETE',
    contentType: 'application/json; charset=utf-8',
    // if data inserted
    success(data, textStatus, xhr) {
      $('#employeeListing').html('');
      loadEmployeeByLimit(1);
      // if id in the params not valid show error
      if (xhr.status === 404) {
        // set and call error message
        // eslint-disable-next-line no-use-before-define
        errMsg = 'Not valid id';
        // eslint-disable-next-line vars-on-top
        let errMsg = '';
        new Noty({
          timeout: '3000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: errMsg,
        }).show();
        $('#employeeListing').html('');
        loadEmployeeByLimit(1);
      } else if (xhr.status === 200) {
        // if the params id is valid and
        // set and call confirmation message
        msg = 'Successfully deleted!';
        new Noty({
          timeout: '3000',
          type: 'success',
          layout: 'topCenter',
          theme: 'sunset',
          text: msg,
        }).show();
      }
    },
    error(xhr) {
      // set and call error message
      let errMsg = '';
      if (xhr.status === 500) {
        errMsg = 'Server Issues';
      } else {
        errMsg = 'There is some other issues here';
      }
      new Noty({
        timeout: '3000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: errMsg,
      }).show();
    },

  });
}

function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];

  // increment along the first column of each row
  let i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  let j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1, // deletion
          ),
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

userSearch.addEventListener('keyup', (e) => {
  let RowInfo = {};
  const similarResults = [];
  const searchString = e.target.value.toLowerCase();
  $('#pagination').html('');

  // eslint-disable-next-line arrow-body-style
  let filterUsers = userSearchChar.filter((user) => {
    return (
      user.EmployeeName.toLowerCase().includes(searchString)
    );
  });

  // If statement to run the loadCustomersByLimit function
  // if there are no inputs
  if (searchString === '') {
    filterUsers = [];
    $('#similarSearch').html('');
    $('#employeeListing').html('');
    loadEmployeeByLimit(1);
    return;
  }

  $('#similarSearch').html('');
  $('#employeeListing').html('');
  if (filterUsers.length !== 0) {
    for (let i = 0; i < filterUsers.length; i++) {
      const employee = filterUsers[i];

      // compile the data that the card needs for its creation
      RowInfo = {
        EmployeeID: employee.EmployeeID,
        EmployeeName: employee.EmployeeName,
        EmployeeDes: employee.EmployeeDes,
        EmployeeImgUrl: employee.EmployeeImgUrl,
        Skillsets: employee.Skillsets,
      };

      const newCard = createRow(RowInfo);
      $('#employeeListing').append(newCard);
    }
  } else {
    for (let i = 0; i < userSearchChar.length; i++) {
      const compared = userSearchChar[i].EmployeeName;
      const distance = levenshtein(searchString, compared.toLowerCase()); // Levenshtein Distance
      const employee = userSearchChar[i];

      // compile the data that the card needs for its creation
      RowInfo = {
        EmployeeID: employee.EmployeeID,
        EmployeeName: employee.EmployeeName,
        EmployeeDes: employee.EmployeeDes,
        EmployeeImgUrl: employee.EmployeeImgUrl,
        Skillsets: employee.Skillsets,
      };

      if (distance <= 4) {
        similarResults.push(RowInfo);
      }
    }

    for (let j = 0; j < similarResults.length; j++) {
      const newCard = createRow(similarResults[j]);
      $('#employeeListing').append(newCard);
    }
    $('#similarSearch').html(`<p><b>${searchString}</b> not found, do you mean...</p><br>`);
  }
});

$(document).ready(() => {
  const queryParams = new URLSearchParams(window.location.search);

  loadEmployeeByLimit(1);

  // update button
  $('#editEmployeeBtn').click(() => {
    updateEmployee();
  });

  // Get employee Availability date button
  $('#employeAvailBtn').click(() => {
    loadEmployeeAvailability();
  });

  // delete button
  $('#deleteEmployeeBtn').click(() => {
    const employeeID = $('#deleteEmployeeID').val();
    deleteEmployee(employeeID);
  });
});

// function to add Employee
// eslint-disable-next-line no-unused-vars
function addEmployee() {
  // get value of the image uploaded from input file
  const image = document.getElementById('image');
  // get value of the employee name from employee name field
  const employeeName = $('#addEmployeeName').val();
  // get value from employee description field
  const employeeDes = $('#addEmployeeDes').val();
  // get value from skill set field
  const skillSet = $('#addEmployeeSkills').val();
  // get value from MobileNo set field
  const MobileNo = $('#addEmployeePhone').val();
  //  pattern for Mobile No
  const phoneNumberPattern = new RegExp('^(6|8|9)\\d{7}$');
  // check if Mobile match with the pattern
  if (!phoneNumberPattern.test(MobileNo)) {
    new Noty({
      timeout: '5000',
      type: 'error',
      layout: 'topCenter',
      theme: 'sunset',
      text: 'Please enter a valid Mobile Number.',
    }).show();
    return;
  }

  // create a variable called webFormData and call the FormData
  // instance all field value to be added will be appended to webFormData
  const webFormData = new FormData();
  // webFormData.append method to append employeeName to the key of employeeName
  webFormData.append('employeeName', employeeName);
  // webFormData.append method to append employeeDes to the key of employeeDes
  webFormData.append('employeeDes', employeeDes);
  // webFormData.append method to append skillSet to the key of skillSet
  webFormData.append('skillSet', skillSet);
  // webFormData.append method to append MobileNo to the key of MobileNo
  webFormData.append('MobileNo', MobileNo);
  // webFormData.append method to append image.files[0] to the key of image
  webFormData.append('image', image.files[0]);
  // ajax fuction to connect to the backend
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    // url to connect to backend api
    url: `${backEndUrl}/addEmployee`,
    // method type
    type: 'POST',
    // setting processData false
    processData: false,
    // setting contentType false
    contentType: false,
    // setting cache false
    cache: false,
    // pass webForm data as data
    data: webFormData,
    // pass enctype as multipart/formdata
    enctype: 'multipart/form-data',
    // success method
    success(xhr) {
      // set value to empty after getting value
      $('#addEmployeeName').val('');
      $('#addEmployeeDes').val('');
      $('#addEmployeeSkills').val('');
      $('#addEmployeePhone').val('');
      document.getElementById('image').value = '';
      document.getElementById('ppPreview').style.backgroundImage = `url(../../assets/img/camera-icon.png)`;
      // succcess message return
      $('#employeeListing').html('');
      loadEmployeeByLimit(1);
      new Noty({
        timeout: '3000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: 'Image Uploaded',
      }).show();
    },
    // error method
    error(xhr) {
      // error message return
      if (xhr.status === 500) {
        let errMsg = '';
        errMsg = 'Server Error';
        new Noty({
          timeout: '3000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: errMsg,
        }).show();
      }
    },
  });
}

function readURL(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      // $('#blah').attr('src', e.target.result);
      document.getElementById('ppPreview').style.backgroundImage = `url( ${e.target.result})`;
    };

    reader.readAsDataURL(input.files[0]);
  }
}

$('#image').change(function () {
  readURL(this);
});

function readNewURL(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      // $('#blah').attr('src', e.target.result);
      document.getElementById('NewProfilePreview').style.backgroundImage = `url( ${e.target.result})`;
    };

    reader.readAsDataURL(input.files[0]);
  }
}

$('#image_edit').change(function () {
  readNewURL(this);
});
