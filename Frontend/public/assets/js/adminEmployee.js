/* eslint-disable linebreak-style */
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
                <button type="button" class="edit-btn" data-toggle="modal" data-target="#editModal">Edit</button>
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

function loadABaby(id) {
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
  console.log('load a baby runs');
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
  $.ajax({

    url: `http://localhost:8000/babies/${id}`,
    type: 'GET',

    contentType: 'application/json; charset=utf-8',

    success(data) {
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);

      const RowInfo = {
        id: data[0].id,
        name: data[0].name,
        height_six_month: data[0].height_six_month,
        height_seven_month: data[0].height_seven_month,
        height_eight_month: data[0].height_eight_month,
        height_nine_month: data[0].height_nine_month,
        height_ten_month: data[0].height_ten_month,
      };

      console.log('---------Card INfo data pack------------');
      console.log(RowInfo);

      $('#baby-id-update').val(RowInfo.id);
      $('#baby-name-update').val(RowInfo.name);
      $('#baby-height-six-month-update').val(RowInfo.height_six_month);
      $('#baby-height-seven-month-update').val(RowInfo.height_seven_month);
      $('#baby-height-eight-month-update').val(RowInfo.height_eight_month);
      $('#baby-height-nine-month-update').val(RowInfo.height_nine_month);
      $('#baby-height-ten-month-update').val(RowInfo.height_ten_month);

      $('#babyTableBody').html('');
      loadAllEmployees();
    },

    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');

      if (xhr.status == 201) {
        errMsg = "The id doesn't exist ";
      }
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}

$(document).ready(() => {
  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------Query Params----------');
  console.log(`Query Param (source): ${window.location.search}`);
  console.log(`Query Param (extraction): ${queryParams}`);

  loadEmployeeByLimit(1);
});
