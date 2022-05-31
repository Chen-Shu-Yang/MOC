/* eslint-disable linebreak-style */
/* eslint-disable func-names */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */

// const frontEndUrl = 'https://spspforum.herokuapp.com';
// const backEndUrl = 'https://spspforum-backend.herokuapp.com';
// const url = 'http://localhost:5000';

function createRow(cardInfo) {
  console.log(cardInfo);

  const card = `
      <div class="employee-card">
          <div class="employee-id">
              <img src="${cardInfo.EmployeeImg}" alt="">
              <span>${cardInfo.EmployeeName}</span>
          </div>
          <p class="employee-des">${cardInfo.EmployeeDes}</p>
          <div class="employee-links">
              <a href="" data-toggle="modal" data-target="#">View Skillsets</a>
              <a href="" data-toggle="modal" data-target="#viewEmpAvailabilityModal">View Availability</a>
          </div>
          <div class="employee-btn">
              <button type="button" class="edit-btn" data-toggle="modal" data-target="#editModal" onClick="loadAnEmployee(${cardInfo.EmployeeID})">Edit</button>
              <button type="button" class="delete-btn" data-toggle="modal" data-target="#deleteModal">Delete</button>
          </div>
      </div>
`;
  return card;
}

function pageBtnCreate(totalNumberOfPages) {
  $('#pagination').html('');
  for (i = 1; i <= totalNumberOfPages; i++) {
    divPaginBtn = `<button type="button" onClick="loadEmployeeByLimit(${i})">${i}</button>`;
    $('#pagination').append(divPaginBtn);
  }
}

function loadAllEmployees() {
  $.ajax({
    url: 'http://localhost:5000/employee',
    type: 'GET',
    contentType: 'application/json; charset=utf-8',

    success(data) {
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);

      const totalNumberOfPages = Math.ceil(data.length / 6);

      pageBtnCreate(totalNumberOfPages);
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

function loadEmployeeByLimit(pageNumber) {
  $.ajax({
    url: `http://localhost:5000/employee/${pageNumber}`,
    type: 'GET',

    contentType: 'application/json; charset=utf-8',

    success(data) {
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);
      $('#employeeListing').html('');

      for (let i = 0; i < data.length; i++) {
        const employee = data[i];

        const RowInfo = {
          EmployeeID: employee.EmployeeID,
          EmployeeName: employee.EmployeeName,
          EmployeeDes: employee.EmployeeDes,
          EmployeeImg: employee.EmployeeImg,
          Skillsets: employee.Skillsets,
        };

        console.log('---------Card INfo data pack------------');
        console.log(RowInfo);

        const newRow = createRow(RowInfo);
        $('#employeeListing').append(newRow);
      }
      loadAllEmployees();
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
  console.log(id);
  $.ajax({
    url: `http://localhost:5000/oneemployee/${id}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',

    success(data) {
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);

      const employee = data[0];

      const RowInfo = {
        EmployeeID: employee.EmployeeID,
        Name: employee.EmployeeName,
        Description: employee.EmployeeDes,
        EmployeeImg: employee.EmployeeImg,
        Skillsets: employee.Skillsets,
      };

      console.log('---------Card INfo data pack------------');
      console.log(RowInfo);

      document.getElementById('NewProfilePreview').style.backgroundImage = 'url(../img/profile2.jpg)';
      $('#editEmployeeID').val(RowInfo.EmployeeID);
      $('#editEmployeeName').val(RowInfo.Name);
      $('#editEmployeeDes').val(RowInfo.Description);
      $('#editEmployeeSkills').val(RowInfo.Skillsets);
      $('#editProfilePicLink').val(RowInfo.EmployeeImg);
    },

    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');

      // if (xhr.status == 201) {
      //     errMsg = "The id doesn't exist "
      // }
      // $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}

function updateEmployee() {
  // data extraction
  const id = $('#editEmployeeID').val();
  const employeeName = $('#editEmployeeName').val();
  const employeeDes = $('#editEmployeeDes').val();
  const employeeSkills = $('#editEmployeeSkills').val();
  const employeeImg = $('#editProfilePicLink').val();

  // get item from local storage
  const data = {
    EmployeeName: employeeName,
    EmployeeDes: employeeDes,
    EmployeeSkills: employeeSkills,
    EmployeeImg: employeeImg,
  };
  console.log(`DATA: ${data}`);

  // call the web service endpoint
  $.ajax({
    // headers: { authorization: `Bearer ${tmpToken}` },
    url: `http://localhost:5000/employees/${id}`,
    type: 'PUT',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('Update Successful');
      $('#employeeListing').html('');
      loadEmployeeByLimit(1);
    },
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log('-----------------------');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);

      console.log(xhr.status);
      console.log(xhr.responseText);
    },
  });
}

$(document).ready(() => {
  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------Query Params----------');
  console.log(`Query Param (source): ${window.location.search}`);
  console.log(`Query Param (extraction): ${queryParams}`);

  loadEmployeeByLimit(1);

  // update button
  $('#editEmployeeBtn').click(() => {
    updateEmployee();
  });
});

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

$('#file_photo').change(function () {
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

$('#edit_picture_file').change(function () {
  readNewURL(this);
});
