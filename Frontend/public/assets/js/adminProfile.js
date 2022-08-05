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
function loadProfileDetails() {
  const adminID = localStorage.getItem('AdminID');
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/admin/profile/${adminID}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      const adminDetails = data[0];
      $('#firstName').val(adminDetails.FirstName);
      $('#lastName').val(adminDetails.LastName);
      $('#phone').val(adminDetails.PhoneNumber);
      $('#email').val(adminDetails.Email);
    },
    error(xhr, textStatus, errorThrown) {
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

$('#updateProfile').click(() => {
  const emailPattern = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$');
  const firstName = $('#firstName').val();
  const lastName = $('#lastName').val();
  const email = $('#email').val();
  const adminID = localStorage.getItem('AdminID');
  const info = {
    firstName,
    lastName,
    email,
  };
  if (emailPattern.test(email)) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/update/admin/${adminID}`,
    type: 'PUT',
    data: JSON.stringify(info),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null) {
        new Noty({
          timeout: '5000',
          type: 'success',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Profile updated! ',
        }).show();
      } else {
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
    error(xhr, textStatus, errorThrown) {
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: 'Please check your ID',
      }).show();
    },
  });
  }else {
    new Noty({
      timeout: '5000',
      type: 'error',
      layout: 'topCenter',
      theme: 'sunset',
      text: 'Please use valid Email',
    }).show();
  }
});

$('#changePassword').click(() => {
  const currentPw = $('#currentPassword').val();
  const newPw = $('#newPassword').val();
  const confirmPw = $('#confirmPassword').val();
  const adminID = localStorage.getItem('AdminID');
  const info = {
    currentPassword: currentPw,
    newPassword: newPw,
    confirmPassword: confirmPw,
  };
  if (newPw === confirmPw) {
    $.ajax({
      headers: { authorization: `Bearer ${tmpToken}` },
      url: `${backEndUrl}/admin/password/${adminID}`,
      type: 'PUT',
      data: JSON.stringify(info),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success(data) {
        if (data.success === true) {
          $.ajax({
            headers: { authorization: `Bearer ${tmpToken}` },
            url: `${backEndUrl}/admin/editPassword/${adminID}`,
            type: 'PUT',
            data: JSON.stringify(info),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success() {
              new Noty({
                timeout: '5000',
                type: 'success',
                layout: 'topCenter',
                theme: 'sunset',
                text: 'Changed successfully!',
              }).show();
            },
            error(xhr) {
              new Noty({
                timeout: '5000',
                type: 'error',
                layout: 'topCenter',
                theme: 'sunset',
                text: xhr.responseText,
              }).show();
            }
          });
        }
      },
      error(xhr, textStatus, errorThrown) {
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: xhr.responseText,
        }).show();
      },
    });
  } else {
    new Noty({
      timeout: '5000',
      type: 'error',
      layout: 'topCenter',
      theme: 'sunset',
      text: 'Password is not the same',
    }).show();
  }
});

const togglePasswordCurrent = document.querySelector('#togglePasswordCurrentPass');
const currentPassword = document.querySelector('#currentPassword');
togglePasswordCurrent.addEventListener('click', function (e) {
  const type = currentPassword.getAttribute('type') === 'password' ? 'text' : 'password';
  currentPassword.setAttribute('type', type);
  this.classList.toggle('fa-eye-slash');
});

const togglePasswordNew = document.querySelector('#togglePasswordNewPass');
const newPassword = document.querySelector('#newPassword');

togglePasswordNew.addEventListener('click', function (e) {
  const type = newPassword.getAttribute('type') === 'password' ? 'text' : 'password';
  newPassword.setAttribute('type', type);
  this.classList.toggle('fa-eye-slash');
});

const togglePasswordConfirm = document.querySelector('#togglePasswordConfirmPass');
const confirmPassword = document.querySelector('#confirmPassword');

togglePasswordConfirm.addEventListener('click', function (e) {
  const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
  confirmPassword.setAttribute('type', type);
  this.classList.toggle('fa-eye-slash');
});

$(document).ready(() => {
  const queryParams = new URLSearchParams(window.location.search);
  loadProfileDetails();
});
