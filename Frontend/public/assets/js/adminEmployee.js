const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
// const frontEndUrl = 'http://18.142.170.203:3001/';
// const backEndUrl = 'http://18.142.170.203:5000/';

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
function pageBtnCreate(totalNumberOfPages, activePage) {
  $('#pagination').html('');
  let maxLeft = (activePage - Math.floor(5 / 2));
  let maxRight = (activePage + Math.floor(5 / 2));
  if (maxLeft < 1) {
    maxLeft = 1;
    maxRight = 5;
  }
  if (maxRight > totalNumberOfPages) {
    maxLeft = totalNumberOfPages - (5 - 1);
    maxRight = totalNumberOfPages;
    if (maxLeft < 1) {
      maxLeft = 1;
    }
  }
  if (activePage !== 1) {
    divPaginBtn = `<button type="button" onClick="loadEmployeeByLimit(${1})"><<</button>`;
    $('#pagination').append(divPaginBtn);
  }
  for (i = maxLeft; i <= maxRight; i++) {
    if (i === activePage) {
      divPaginBtn = `<button type="button" class="active" onClick="loadEmployeeByLimit(${i})">${i}</button>`;
      $('#pagination').append(divPaginBtn);
    } else {
      divPaginBtn = `<button type="button" onClick="loadEmployeeByLimit(${i})">${i}</button>`;
      $('#pagination').append(divPaginBtn);
    }
  }
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
      if (data.length === 0) {
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
          if (RowInfo.TimeSlot === '08:30:00') {
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
      errMsg="Error in operation"
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: errMsg,
      }).show();
    },
  });
}

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
  const image_edit = document.getElementById('image_edit');
  const employeeName = $('#editEmployeeName').val();
  const employeeDes = $('#editEmployeeDes').val();
  const skillSet = $('#editEmployeeSkills').val();
  const MobileNo = $('#editEmployeePhone').val();
  const phoneNumberPattern = new RegExp('^(6|8|9)\\d{7}$');
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
  const initialImg = $('#NewProfilePreview').css('background-image').replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
  const webFormData = new FormData();
  webFormData.append('employeeName', employeeName);
  webFormData.append('employeeDes', employeeDes);
  webFormData.append('skillSet', skillSet);
  webFormData.append('MobileNo', MobileNo);
  webFormData.append('initialImg', initialImg);
  webFormData.append('image_edit', image_edit.files[0]);
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/employee/${id}`,
    type: 'PUT',
    processData: false,
    contentType: false,
    cache: false,
    data: webFormData,
    enctype: 'multipart/form-data',
    success() {
      $('#editEmployeeName').val('');
      $('#editEmployeeDes').val('');
      $('#editEmployeeSkills').val('');
      $('#editEmployeePhone').val('');
      document.getElementById('image_edit').value = '';
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
    error(xhr) {
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
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/employee/${id}`,
    type: 'DELETE',
    contentType: 'application/json; charset=utf-8',
    success(data, textStatus, xhr) {
      $('#employeeListing').html('');
      loadEmployeeByLimit(1);
      if (xhr.status === 404) {
        errMsg = 'Not valid id';
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
  let i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  let j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, 
          Math.min(
            matrix[i][j - 1] + 1, 
            matrix[i - 1][j] + 1, 
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
  let filterUsers = userSearchChar.filter((user) => {
    return (
      user.EmployeeName.toLowerCase().includes(searchString)
    );
  });
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
      const distance = levenshtein(searchString, compared.toLowerCase()); 
      const employee = userSearchChar[i];
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
  $('#editEmployeeBtn').click(() => {
    updateEmployee();
  });
  $('#employeAvailBtn').click(() => {
    loadEmployeeAvailability();
  });

  $('#deleteEmployeeBtn').click(() => {
    const employeeID = $('#deleteEmployeeID').val();
    deleteEmployee(employeeID);
  });
});
function addEmployee() {
  const image = document.getElementById('image');
  const employeeName = $('#addEmployeeName').val();
  const employeeDes = $('#addEmployeeDes').val();
  const skillSet = $('#addEmployeeSkills').val();
  const MobileNo = $('#addEmployeePhone').val();
  const phoneNumberPattern = new RegExp('^(6|8|9)\\d{7}$');
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
  const webFormData = new FormData();
  webFormData.append('employeeName', employeeName);
  webFormData.append('employeeDes', employeeDes);
  webFormData.append('skillSet', skillSet);
  webFormData.append('MobileNo', MobileNo);
  webFormData.append('image', image.files[0]);
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/addEmployee`,
    type: 'POST',
    processData: false,
    contentType: false,
    cache: false,
    data: webFormData,
    enctype: 'multipart/form-data',
    success(xhr) {
      $('#addEmployeeName').val('');
      $('#addEmployeeDes').val('');
      $('#addEmployeeSkills').val('');
      $('#addEmployeePhone').val('');
      document.getElementById('image').value = '';
      document.getElementById('ppPreview').style.backgroundImage = `url(../../assets/img/camera-icon.png)`;
      $('#employeeListing').html('');
      loadEmployeeByLimit(1);
      new Noty({
        timeout: '3000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: 'Employee added',
      }).show();
    },
    error(xhr) {
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
      document.getElementById('NewProfilePreview').style.backgroundImage = `url( ${e.target.result})`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

$('#image_edit').change(function () {
  readNewURL(this);
});
