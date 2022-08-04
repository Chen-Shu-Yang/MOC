const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
// const frontEndUrl = 'http://18.142.170.203:3001/';
// const backEndUrl = 'http://18.142.170.203:5000/';



$(document).ready(() => {
  const togglePassword = document.querySelector('#togglePassword');
  const password = document.querySelector('#pwdInput');

  togglePassword.addEventListener('click', function () {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
  });

  $('#Login').click(() => {
    const emails = $('#emailInput').val();
    const pwd = $('#pwdInput').val();
    const info = {
      email: emails,
      password: pwd,
    };
    $.ajax({
      url: `${backEndUrl}/login`,
      type: 'POST',
      data: JSON.stringify(info),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success(data) {
        if (data != null) {
          if (data.CustomerID != null) {
            localStorage.setItem('token', JSON.stringify(data.token));
            localStorage.setItem('customerID', JSON.stringify(data.CustomerID));
            window.location.replace(`${frontEndUrl}/customer/profile`);
          } else if (data.AdminType === 'Admin') {
            localStorage.setItem('AdminID', JSON.stringify(data.AdminID));
            localStorage.setItem('adminType', JSON.stringify(data.AdminType));
            localStorage.setItem('token', JSON.stringify(data.token));
            window.location.replace(`${frontEndUrl}/admin/dashboard`);
          } else {
            localStorage.setItem('AdminID', JSON.stringify(data.AdminID));
            localStorage.setItem('adminType', JSON.stringify(data.AdminType));
            localStorage.setItem('token', JSON.stringify(data.token));
            window.location.replace(`${frontEndUrl}/admin/dashboard`);
          }
        }
      },
      error(xhr) {
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: xhr.responseText,
        }).show();
      },
    });
    return false;
  });
});
