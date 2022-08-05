const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
// const frontEndUrl = 'http://18.142.170.203:3001/';
// const backEndUrl = 'http://18.142.170.203:5000/';


const tmpToken = JSON.parse(localStorage.getItem('token'));
if (tmpToken === null) {
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}
const tempCustomerID = JSON.parse(localStorage.getItem('customerID'));
if (tempCustomerID === null) {
  window.localStorage.clear();
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}

$('#changePassword').click(() => {
  const currentPw = $('#currentPassword').val();
  const newPw = $('#newPassword').val();
  const confirmPw = $('#confirmPassword').val();
  const customerID = localStorage.getItem('customerID');
  const info = {
    currentPassword: currentPw,
    newPassword: newPw,
    confirmPassword: confirmPw,
  };
  if (newPw === confirmPw) {
    $.ajax({
      headers: { authorization: `Bearer ${tmpToken}` },
      url: `${backEndUrl}/customer/password/${customerID}`,
      type: 'PUT',
      data: JSON.stringify(info),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success(data) {
        if (data.success === true) {
          $.ajax({
            headers: { authorization: `Bearer ${tmpToken}` },
            url: `${backEndUrl}/customer/editPassword/${customerID}`,
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
                text: 'Changed successfully',
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
