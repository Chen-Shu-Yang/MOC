const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
// const frontEndUrl = 'http://18.142.170.203:3001/';
// const backEndUrl = 'http://18.142.170.203:5000/';


const tmpToken = JSON.parse(localStorage.getItem('token'));
const tempAdminID = JSON.parse(localStorage.getItem('AdminID'));
if (tmpToken === null || tempAdminID === null) {
  window.localStorage.clear();
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}

function createRow(cardInfo) {
  const card = `
        <div class="employee-card">
            <img src="${cardInfo.EmployeeImg}" alt="">
            <div class="employee-details">
                <span class="employee-name">${cardInfo.EmployeeName}</span><br>
                <span class="employee-des">${cardInfo.EmployeeDes}</span><br>
            </div>
            <input type="checkbox" class="availability" value=${cardInfo.EmployeeID}>
        </div>
    `;
  return card;
}

function loadAllAvailEmployees(date, time) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/availemployee/${date}/${time}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      $('#employee-list').html('');
      $('#confirmBtn').css({ display: 'none' });
      $('#confirmBtn').css({ display: 'block' });
      for (i = 0; i < data.length; i++) {
        const employee = data[i];
        const RowInfo = {
          EmployeeID: employee.EmployeeID,
          EmployeeName: employee.EmployeeName,
          EmployeeDes: employee.EmployeeDes,
          EmployeeImg: employee.EmployeeImgUrl,
        };
        const newCard = createRow(RowInfo);
        $('#employee-list').append(newCard);
      }
    },
    error(xhr, textStatus, errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }else{
        errMsg="Error in operation"
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: errMsg,
      }).show();

      }

    },
  });
}

function ScheduleAvailability(employeeId, date, time) {
  const data = {
    date,
    time,
  };
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/availemployee/${employeeId}`,
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(data),
    dataType: 'json',
    success(data) {
      if (data != null && data.success) {
        $('#employee-list').html('');
        $('#confirmBtn').css({ display: 'none' });
        $('#timing').html('');
        $('.morningSlot').removeClass('active');
        $('.afternoonSlot').removeClass('active');
      }
      new Noty({
        timeout: '3000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: 'Scheduled Successfully',
      }).show();
    },
    error(xhr, errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }
      else{
        errMsg="Error in operation"
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: errMsg,
      }).show();

      }
    },
  });
}

function extractDate() {
  const monthInput = $('.datepicker-switch').html();
  let dayInput = $('.active.day').html();
  let date = `${dayInput} ${monthInput}`;
  if (dayInput === undefined) {
    dayInput = $('.today.day').html();
    date = `${dayInput} ${monthInput}`;
  }
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = `${d.getFullYear()}`;
  if (month.length < 2) {
    month = `0${month}`;
  }
  if (day.length < 2) {
    day = `0${day}`;
  }
  return [year, month, day].join('-');
}

$(document).ready(() => {
  const morningSlot = document.querySelector('.morningSlot');
  const afternoonSlot = document.querySelector('.afternoonSlot');
  let date; let
    time;
  morningSlot.onclick = function () {
    $('.morningSlot').addClass('active');
    $('.afternoonSlot').removeClass('active');
    date = extractDate();
    time = $('.morningSlot').val();
    $('#timing').html('');
    $('#timing').append(`${date}, ${time}`);
    loadAllAvailEmployees(date, time);
  };
  afternoonSlot.onclick = function () {
    $('.afternoonSlot').addClass('active');
    $('.morningSlot').removeClass('active');
    date = extractDate();
    time = $('.afternoonSlot').val();
    $('#timing').html('');
    $('#timing').append(`${date}, ${time}`);
    loadAllAvailEmployees(date, time);
  };
  $('#confirmBtn').click(() => {
    const arr = $('.availability:checked').map(function () {
      return this.value;
    }).get();
    for (let i = 0; i < arr.length; i++) {
      ScheduleAvailability(arr[i], date, time);
    }
  });
});
