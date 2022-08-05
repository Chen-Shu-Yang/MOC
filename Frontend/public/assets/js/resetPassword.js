const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
// const frontEndUrl = 'http://18.142.170.203:3001/';
// const backEndUrl = 'http://18.142.170.203:5000/';



$(document).ready(() => {

  const togglePasswordForgot = document.querySelector('#togglePasswordForget');
  const passwordForgot = document.querySelector('#passwordInput');
  togglePasswordForgot.addEventListener('click', function () {
    const type = passwordForgot.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordForgot.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
  });
  const togglePasswordForgotConfirm = document.querySelector('#togglePasswordForgetConfirm');
  const passwordForgotConfirm = document.querySelector('#passwordInput2');
  togglePasswordForgotConfirm.addEventListener('click', function () {
    const type = passwordForgotConfirm.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordForgotConfirm.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
  });

  $('#confirmPassword').click(() => {
    const password = $('#passwordInput').val();
    const secondPassword = $('#passwordInput2').val();
    const pwdPattern = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
    const idTOken = window.location.search;
    const urlParams = new URLSearchParams(idTOken);
    const id = urlParams.get('id');
    const token = urlParams.get('token');
    const info = {
      password,
    };
    if (pwdPattern.test(password)) {
      if (password === secondPassword) {
        $.ajax({
          headers: { authorization: `Bearer ${token}` },
          url: `${backEndUrl}/resetUserPassword/${id}/${token}`,
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
                text: 'Password Updated',
              }).show();
              window.location.replace(`${frontEndUrl}/login`);
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
              text: 'Invalid link',
            }).show();
          },
        });
      } else {
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Please ensure your both password is correct ',
        }).show();
      }
    } else {
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: 'Please use valid Email or Please use more Secure password. Ensure that it is 8 character, 1 Caps, 1 small and 1 Special character ',
      }).show();
    }
    return false;
  });
});
